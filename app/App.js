import React, { Component } from 'react';

import { getBackends } from './data/general/backend';
import { listPages, getPages, updatePage } from './data/wiki/pages';
import { formatPages } from './utils/page';

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
      alertMessage: 'Welcome to CrypTag'
    };

    this.loadPageList = this.loadPageList.bind(this);
    this.loadPageByKey = this.loadPageByKey.bind(this);
    this.loadBackends = this.loadBackends.bind(this);

    this.onEditPage = this.onEditPage.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);

    this.onSetUsernameClick = this.onSetUsernameClick.bind(this);
    this.onCloseUsernameModal = this.onCloseUsernameModal.bind(this);
    this.onSetUsername = this.onSetUsername.bind(this);

    this.onSelectBackend = this.onSelectBackend.bind(this);
    this.onSetBackend = this.onSetBackend.bind(this);

    this.onHideAlert = this.onHideAlert.bind(this);

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
    
  }

  // failure case #1: what if backends don't load?
  // UI?
  loadBackends(){
    getBackends().then( (response) => {
      let backendName = localStorage.getItem(BACKEND_KEY);
      let backends = response.body;
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

    }, (respErr) => {
      console.log("Error fetching backends: " + respErr);
      this.loadPageList('');
    });
  }

  onSetBackend(backendName){
    localStorage.setItem(BACKEND_KEY, backendName);
    this.setState({
      currentBackendName: backendName
    });
    this.loadPageList(backendName);
  }

  // function called initial load that fetches pages from backend.
  // it sets the currentPage.
  // if used outside of initial load (say, for polling) we need to 
  // update the logic since we don't want to clobber existing 
  // currentPage
  loadPageList(backend){
    // TODO: Get pages from all Backends, not just the current/default
    console.log('backend');
    console.log(backend);

    listPages(backend).then( (response) => {
      let pages = formatPages(response.body);

      this.setState({
        pages: pages,
        isLoading: false
      });

      if (pages.length > 0){
        this.loadPageByKey(pages[0].key)
      }

    }, (respErr) => {
      console.log("Error loading page list: " + respErr);

      // Would probably be better to revert to previous backend and
      // continue showing its pages list, but this is a quick fix that
      // keeps the selected backend and the pages list in sync

      // if no pages, bring up edit form and encourage to create a 
      // first page ?
      this.setState({
        currentPage: {},
        pages: [],
        isLoading: false
      });
    });
  }

  loadPageByKey(pageKey){
    this.setState({'isLoading': true });
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackendName;
    getPages(backend, [pageKey]).then( (response) => {
      let pages = formatPages(response.body);
      if (pages.length === 0) {
        console.log("Error fetching row with ID tag", pageKey, "from Backend",
                    backend);
        return;
      }

      this.setState({
        currentPage: pages[0],
        isLoading: false
      });
    })
  }

  pollForPages(){
    setInterval(() => {
      console.log("Fake-polling for new pages, or updates to the current page, or somethin'...");
    }, 5000)
  }

  onEditPage(){
    console.log('editing!')
    this.setState({
      isEditing: true
    });
  }

  onUpdatePage(pageKey, pageTitle, pageContent){
    console.log('saving!');
    console.log(pageKey);

    updatePage(pageKey, pageTitle, pageContent, this.state.currentBackendName)
      .then((response) => {
        console.log(response.body);
        // TODO: response returns new page object?
        // format the contents and then 
        // make that the currentPage in state

        this.setState({
          isEditing: false
        });
      },
      (respErr) => {
        console.log("Error saving page with ID-tag", pageKey, ";", respErr);
      });
  }

  onCancelUpdate(){
    this.setState({
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

  render(){
    let { pages, currentPage, isLoading, isEditing } = this.state;
    let { username, showUsernameModal } = this.state;
    let { backends, currentBackendName } = this.state;
    let { alertMessage, alertStyle, showAlert} = this.state;
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

          <div className="backend-container">
            <h3>Backends</h3>
            <DropdownList
              data={backends.map(bk => bk.Name)}
              value={currentBackendName}
              onChange={this.onSelectBackend} />
          </div>

          <WikiPageList
            pages={pages}
            loadPageByKey={this.loadPageByKey}
            page={currentPage} />

        </div>

        <div className="main-content">
          <main>
            <div className="wiki-container">
              {isLoading && <Throbber/> }
              {!isLoading && <WikiContainer
                                page={currentPage}
                                isEditing={isEditing}
                                onEditPage={this.onEditPage}
                                onCancelUpdate={this.onCancelUpdate}
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
