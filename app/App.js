import fse from 'fs-extra';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';

import React, { Component } from 'react';
import {HotKeys} from 'react-hotkeys';

import { getBackends } from './data/general/backend';
import { listPagesVersionedLatest, getPagesVersionedLatest, updatePage, createPage } from './data/wiki/pages';
import { formatPages, formatPage } from './utils/page';
import { versionsOfSameRow } from './utils/row';

import DropdownList from 'react-widgets/lib/DropdownList';
import WikiPageList from './components/wiki/WikiPageList';
import WikiContainer from './components/wiki/WikiContainer';
import Throbber from './components/general/Throbber';
import AlertContainer from './components/general/AlertContainer';
import UsernameModal from './components/modals/Username';

const USERNAME_KEY = 'username';
const BACKEND_KEY = 'current_backend';

const errNoNotesFound = 'No notes found in this Backend. Create a note, or try another Backend!';

let wikiContainerKeyMap = {
  'saveNote': 'mod+s'
}
let appKeyMap = {
  'newNote': 'mod+n'
}

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
      showAlert: false,
      saveSuccess: false,
      alertMessage: 'Welcome to CrypTag Notes!',
      alertStyle: 'success',
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
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onSaveSuccess = this.onSaveSuccess.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);

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

  onError(errStr) {
    console.log(errStr);

    this.setState({
      showAlert: true,
      alertMessage: errStr,
      alertStyle: 'error' // Changing this changes nothing...
    })
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
      this.onError("Error fetching backends: " + err);

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

    listPagesVersionedLatest(backend).then( (response) => {
      let pages = formatPages(response);

      this.setState({
        pages: pages,
        isLoading: false,
        showAlert: false,
        alertMessage: ''
      });
    }).catch((err) => {
      // Would probably be better to revert to previous backend and
      // continue showing its pages list, but this is a quick fix that
      // keeps the selected backend and the pages list in sync

      this.setState({
        currentPage: {},
        pages: [],
        isLoading: false,
        isEditing: true
      });

      if (err.message.toLowerCase().includes('not found')) {
        if (this.state.alertMessage === errNoNotesFound){
          // Don't keep bugging the user
          return;
        }
        this.onError(errNoNotesFound);
        return;
      }

      this.onError(`Error loading notes list: ${err}. (Make sure cryptagd is running!)`);
    });
  }

  loadPageByKey(pageKey){
    this.setState({
      isLoading: true,
      isEditing: false
    });
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackendName;
    getPagesVersionedLatest(backend, [pageKey]).then( (response) => {
      let pages = formatPages(response);
      if (pages.length === 0) {
        this.onError(`Error fetching note with ID tag '${pageKey}' from Backend ${backend}`);
        return;
      }

      this.setState({
        currentPage: pages[0],
        isLoading: false
      });
    }).catch((err) => {
      this.setState({
        currentPage: {},
        isLoading: false,
        isEditing: true
      });

      this.onError("Error from getPagesVersionedLatest: " + err);
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
          currentPage: newPage,
          pages: [newPage, ...this.state.pages]
        });
        this.onSaveSuccess(500);
      })
      .catch((err) => {
        this.onError(`Error creating new note with title "${shadowPage.title}"; error: ${err}`);
      });
  }

  onUpdatePage(){
    console.log('updating!');
    let { shadowPage, currentPage, currentBackendName } = this.state;

    updatePage(currentPage.key, shadowPage.title, shadowPage.contents, currentBackendName)
      .then((response) => {
        let newPage = formatPage(response);
        newPage.contents = shadowPage.contents;

        let replaceNdx = -1;

        // Find the page we just updated and replace it below

        let pages = this.state.pages;
        for (let i = 0; i < pages.length; i++) {
          if (versionsOfSameRow(pages[i], newPage)){
            replaceNdx = i;
            break
          }
        }

        var newPages;
        if (replaceNdx !== -1){
          // Replace old version
          newPages = [...pages.slice(0, replaceNdx),
                      newPage,
                      ...pages.slice(replaceNdx+1)]
        } else {
          // If page we're updating not found, prepend new one to pages list
          newPages = [newPage, ...pages];
        }

        this.setState({
          currentPage: newPage,
          pages: newPages
        });
        this.onSaveSuccess(500);

      })
      .catch((err) => {
        this.onError(`Error updating note with ID-tag '${currentPage.key}'; error: ${err}`);
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

  onCancelClick(e){
    e.preventDefault();
    this.onCancelUpdate();

    return false;
  }

  onSaveClick(e){
    e.preventDefault();

    if (this.state.currentPage.key) {
      this.onUpdatePage();
    } else {
      this.onCreatePage();
    }

    return false;
  }

  onSaveSuccess(delay){
    this.setState({
      saveSuccess: true
    });

    setTimeout(() => {
      this.setState({
        saveSuccess: false
      });
    }, delay)
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

  onHideAlert(e){
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
        console.log('Error creating ~/.cryptag/backends --', err);
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

          // Make the new Backend the one that is selected after restart
          localStorage.setItem(BACKEND_KEY, name);

          alert(`New backend "${name}" created! Please restart CrypTag Notes` +
                " (and, if you're a geek, also restart cryptagd).");
        }
      });
    }
  }

  hotkeyHandlers() {
    return {
      'newNote': this.onBlankPageClick,
      'saveNote': this.onSaveClick
    }
  }

  render(){
    let { pages, currentPage, shadowPage, isLoading, isEditing } = this.state;
    let { username, showUsernameModal } = this.state;
    let { backends, currentBackendName } = this.state;
    let { alertMessage, alertStyle, showAlert} = this.state;
    let { isPreviewMode, onTogglePreviewMode } = this.state;
    let { saveSuccess } = this.state;

    return (
     <HotKeys keyMap={appKeyMap} handlers={this.hotkeyHandlers()}>
      <div className="app">
        <AlertContainer
          message={alertMessage}
          alertStyle={alertStyle}
          showAlert={showAlert}
          onAlertDismiss={this.onHideAlert} />

        <div className="side-content">
          <h1>CrypTag Notes</h1>
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
             <HotKeys keyMap={wikiContainerKeyMap} handlers={this.hotkeyHandlers()}>
              {isLoading && <Throbber/> }
              {!isLoading && <WikiContainer
                                page={currentPage}
                                shadowPage={shadowPage}
                                onUpdateShadowPage={this.onUpdateShadowPage}
                                isEditing={isEditing}
                                isPreviewMode={isPreviewMode}
                                saveSuccess={saveSuccess}
                                onTogglePreviewMode={this.onTogglePreviewMode}
                                onEditPage={this.onEditPage}
                                onCancelUpdate={this.onCancelUpdate}
                                onSaveClick={this.onSaveClick}
                                onCancelClick={this.onCancelClick} />}
             </HotKeys>
            </div>
          </main>
        </div>
      </div>
     </HotKeys>
    );
  }
}

App.propTypes = {}

export default App;
