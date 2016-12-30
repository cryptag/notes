import fse from 'fs-extra';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

import React, { Component } from 'react';

import { getBackends } from './data/general/backend';
import { listPages, getPages, updatePage, createPage } from './data/wiki/pages';
import { formatPages, formatPage } from './utils/page';

import DropdownList from 'react-widgets/lib/DropdownList';
import WikiPageList from './components/wiki/WikiPageList';
import WikiContainer from './components/wiki/WikiContainer';
import Throbber from './components/general/Throbber';
import AlertContainer from './components/general/AlertContainer';
import UsernameModal from './components/modals/Username';

const USERNAME_KEY = 'username';
const BACKEND_KEY = 'current_backend';

class App extends Component {
  constructor(){
    super(...arguments);

    let username = localStorage.getItem(USERNAME_KEY);

    this.state = {
      currentBackendName: '',
      backends: [],
      currentPage: {},
      pages: [],
      username: username,
      showUsernameModal: false,
      isLoading: true,
      isEditing: false,
      showAlert: true,
      alertMessage: 'Welcome to CrypTag Notes!',
      shadowPage: {},
      isPreviewMode: false
    };

    this.loadPageList = this.loadPageList.bind(this);
    this.loadPageByKey = this.loadPageByKey.bind(this);
    this.loadBackends = this.loadBackends.bind(this);

    this.onEditPage = this.onEditPage.bind(this);
    this.onCreatePage = this.onCreatePage.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);
    this.onBlankPageClick = this.onBlankPageClick.bind(this);

    this.onSetUsernameClick = this.onSetUsernameClick.bind(this);
    this.onCloseUsernameModal = this.onCloseUsernameModal.bind(this);
    this.onSetUsername = this.onSetUsername.bind(this);

    this.onSelectBackend = this.onSelectBackend.bind(this);
    this.onSetBackend = this.onSetBackend.bind(this);
    this.onUpdateShadowPage = this.onUpdateShadowPage.bind(this);

    this.onHideAlert = this.onHideAlert.bind(this);

    this.onTogglePreviewMode = this.onTogglePreviewMode.bind(this);

  }

  promptForUsername(){
    this.setState({
      showUsernameModal: true
    });
  }

  loadUsername(){
    let { username } = this.state;

    if (!username){
      this.promptForUsername();
    }
  }

  componentDidMount(){
    this.loadUsername();
    this.loadBackends();
    this.setState({isEditing: true});
    this.pollForPages();
  }

  // failure case #1: what if backends don't load?
  // UI?
  loadBackends(){
    getBackends().then( (response) => {
      let backendName = localStorage.getItem(BACKEND_KEY);
      let backends = response;
      if (backends.length > 0) {
        let backendNames = backends.map(bk => bk.Name);

        if (!backendName){
          backendName = backendNames[0];
          
          if (backendNames.indexOf("default") > -1) {
            backendName = "default";
          }
        }

        console.log("Setting currentBackendName to: ", backendName);

        this.setState({
          backends: backends
        });
        this.onSetBackend(backendName);
      }

    }).catch((err) => {
      console.log("Error fetching backends: " + err);
      this.loadPageList('');
    });
  }

  onSetBackend(backendName){
    localStorage.setItem(BACKEND_KEY, backendName);
    this.setState({
      currentBackendName: backendName,
      currentPage: {},
      isEditing: true
    });
    this.loadPageList(backendName);
  }

  loadPageList(backend){
    // TODO: Get pages from all Backends, not just the current/default
    console.log('backend');
    console.log(backend);

    listPages(backend).then( (response) => {
      let pages = formatPages(response);

      this.setState({
        pages: pages,
        isLoading: false
      });
    }).catch((err) => {
      console.log("Error loading page list: " + err);

      // Would probably be better to revert to previous backend and
      // continue showing its pages list, but this is a quick fix that
      // keeps the selected backend and the pages list in sync

      this.setState({
        currentPage: {},
        pages: [],
        isLoading: false,
        isEditing: true
      });
    });
  }

  loadPageByKey(pageKey){
    this.setState({
      isLoading: true,
      isEditing: false
    });
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackendName;
    getPages(backend, [pageKey]).then( (response) => {
      let pages = formatPages(response);
      if (pages.length === 0) {
        console.log("Error fetching row with ID tag", pageKey, "from Backend",
                    backend);
        return;
      }

      this.setState({
        currentPage: pages[0],
        isLoading: false
      });
    }).catch((err) => {
      console.log("Error from getPages:", err)
      this.setState({
        currentPage: {},
        isLoading: false,
        isEditing: true
      });
    })
  }

  pollForPages(){
    setInterval(() => {
      console.log('polling for pages');
      let { currentBackendName } = this.state;
      this.loadPageList(currentBackendName);
    }, 5000)
  }

  onEditPage(){
    console.log('editing!')
    let { currentPage } = this.state;
    this.setState({
      isEditing: true,
      isPreviewMode: false,
      shadowPage: Object.assign({}, currentPage)
    });
  }

  onCreatePage(pageTitle, pageContent, pageTags){
    console.log('Creating new page with title:', pageTitle);

    let { shadowPage, currentBackendName } = this.state;

    createPage(shadowPage.title, shadowPage.contents, pageTags, currentBackendName)
      .then((response) => {
        let newPage = formatPage(response);

        // cryptagd responds with the plaintags but not the contents
        // (since it could theoretically be huge, the server never
        // does any processing, and whoever's uploading it obviously
        // already has it), so use the local pageContent
        newPage.contents = shadowPage.contents;

        this.setState({
          isEditing: false,
          currentPage: newPage,
          pages: [newPage, ...this.state.pages]
        });
      })
      .catch((err) => {
        console.log("Error creating new page with title", shadowPage.title, ";", err);
      });
  }

  onUpdatePage(){
    console.log('saving!');
    let { shadowPage, currentPage, currentBackendName } = this.state;

    updatePage(currentPage.key, shadowPage.title, shadowPage.contents, currentBackendName)
      .then((response) => {
        let newPage = formatPage(response);
        newPage.contents = shadowPage.contents;

        this.setState({
          isEditing: false,
          isPreviewMode: false,
          shadowPage: {},
          currentPage: newPage,
          pages: [newPage, ...this.state.pages]
        });
      })
      .catch((err) => {
        console.log("Error updating page with ID-tag", currentPage.key, ";", err);
      });
  }

  onBlankPageClick(){
    // TODO: If current document has been changed in the DOM since
    // loading, don't clobber that state

    this.setState({
      currentPage: {},
      shadowPage: {},
      isEditing: true
    })
  }

  onCancelUpdate(){
    this.setState({
      shadowPage: {},
      isPreviewMode: false,
      isEditing: false
    });
  }

  onCloseUsernameModal(){
    this.setState({
      showUsernameModal: false
    });
  }

  onSetUsernameClick(e){
    this.setState({
      showUsernameModal: true
    });
  }

  onSetUsername(username){
    localStorage.setItem(USERNAME_KEY, username);
    this.setState({
      'username': username
    });
    this.onCloseUsernameModal();
  }

  onSelectBackend(newBackendName){
    // TODO: Don't let user do this if they've made changes to the
    // current page

    // TODO: stop setInterval for long-polling document list, start
    // new setInterval
    console.log("Changing Backend from", this.state.currentBackendName, "to",
                newBackendName);
    this.setState({ isLoading: true })
    this.onSetBackend(newBackendName);
  }

  onHideAlert(){
    this.setState({
      showAlert: false
    });
  }

  onUpdateShadowPage(newPage){
    console.log(newPage.title);
    console.log(newPage.contents);
    this.setState({
      shadowPage: Object.assign({}, newPage)
    });
  }

  onTogglePreviewMode(previewMode){
    this.setState({
      isPreviewMode: previewMode
    });
  }

  onDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  onDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    let backendsDir = path.join(os.homedir(), '.cryptag', 'backends');

    mkdirp(backendsDir, (err) => {
      if (err) {
        console.error('Error creating ~/.cryptag/backends --', err);
      }
    });

    let files = e.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
      let j = i;
      // Move Backend config from current location to ~/.cryptag/backends
      fse.move(f.path, path.join(backendsDir, f.name), {clobber: false}, (err) => {
        if (err) {
          console.log("Error moving drag-and-drop'd file:", err);
        } else {
          // TODO(elimisteve): Don't always assume that the Backend
          // name is the filename minus the file extension
          let name = files[j].name.replace('.json', '');
          alert(`New backend "${name}" created! Please restart CrypTag Notes` +
                " (and, if you're a geek, also restart cryptagd).");
        }
      });
    }
  }

  render(){
    let { pages, currentPage, shadowPage, isLoading, isEditing } = this.state;
    let { username, showUsernameModal } = this.state;
    let { backends, currentBackendName } = this.state;
    let { alertMessage, alertStyle, showAlert} = this.state;
    let { isPreviewMode, onTogglePreviewMode } = this.state;
    // still ironing out the contract of the alert component
    // hacking for now.
    let autodismiss = true;

    return (
      <div>
        <AlertContainer
          message={alertMessage}
          alertStyle={alertStyle}
          showAlert={showAlert}
          autodismiss={autodismiss}
          onHideAlert={this.onHideAlert} />

        <div className="side-content">
          <h1>CrypTag Notes&nbsp;<i className="fa fa-handshake-o"></i></h1>
          <hr/>
          <div>
            <i className="fa fa-user-circle-o"></i>&nbsp;
              {username}
              <button className="btn btn-link btn-sm" onClick={this.onSetUsernameClick}>
                <i className="fa fa-pencil-square-o"></i>
              </button>
          </div>
          {showUsernameModal && <UsernameModal 
                                  username={username}
                                  showModal={showUsernameModal}
                                  onSetUsername={this.onSetUsername}
                                  onCloseModal={this.onCloseUsernameModal} />}

          <div className="backend-container" onDragOver={this.onDragOver} onDrop={this.onDrop}>
            <h3>Backends</h3>
            <DropdownList duration={0}
              data={backends.map(bk => bk.Name)}
              value={currentBackendName}
              onChange={this.onSelectBackend} />
          </div>

          <WikiPageList
            pages={pages}
            loadPageByKey={this.loadPageByKey}
            onBlankPageClick={this.onBlankPageClick}
            page={currentPage} />

        </div>

        <div className="main-content">
          <main>
            <div className="wiki-container">
              {isLoading && <Throbber/> }
              {!isLoading && <WikiContainer
                                page={currentPage}
                                shadowPage={shadowPage}
                                onUpdateShadowPage={this.onUpdateShadowPage}
                                isEditing={isEditing}
                                isPreviewMode={isPreviewMode}
                                onTogglePreviewMode={this.onTogglePreviewMode}
                                onEditPage={this.onEditPage}
                                onCancelUpdate={this.onCancelUpdate}
                                onCreatePage={this.onCreatePage}
                                onUpdatePage={this.onUpdatePage}/>}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

App.propTypes = {}

export default App;
