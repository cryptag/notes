import React, { Component } from 'react';

import { listPages, getPages, updatePage } from './data/wiki/pages';
import { formatPages } from './utils/page';

import WikiPageList from './components/wiki/WikiPageList';
import WikiContainer from './components/wiki/WikiContainer';
import Throbber from './components/general/Throbber';
import UsernameModal from './components/modals/Username';

const USERNAME_KEY = 'username';

class App extends Component {
  constructor(){
    super(...arguments);

    let username = localStorage.getItem(USERNAME_KEY);

    this.state = {
      currentBackend: '',
      currentPage: {},
      pages: [],
      username: username,
      showUsernameModal: false,
      isLoading: true,
      isEditing: false
    };

    this.loadPageList = this.loadPageList.bind(this);
    this.loadPageByKey = this.loadPageByKey.bind(this);

    this.onEditPage = this.onEditPage.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);

    this.onSetUsernameClick = this.onSetUsernameClick.bind(this);
    this.closeUsernameModal = this.closeUsernameModal.bind(this);
    this.onSetUsername = this.onSetUsername.bind(this);
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
    this.loadPageList();
  }

  // function called initial load that fetches pages from backend.
  // it sets the currentPage.
  // if used outside of initial load (say, for polling) we need to 
  // update the logic since we don't want to clobber existing 
  // currentPage
  loadPageList(){
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackend;
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
    });
  }

  loadPageByKey(pageKey){
    this.setState({'isLoading': true });
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackend;
    getPages(backend, [pageKey]).then( (response) => {
      let pages = formatPages(response.body);
      if (pages.length === 0) {
        console.log("Error fetching row with ID tag", pageKey, "from Backend", backend);
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

    // is this correct syntax for passing along all func args
    // with spread operator + backend?
    updatePage(...arguments, this.state.currentBackend)
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
        console.log("Error saving page: " + pageKey);
      });
  }

  onCancelUpdate(){
    this.setState({
      isEditing: false
    });
  }

  closeUsernameModal(){
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
    this.closeUsernameModal();
  }

  render(){
    let { pages, currentPage, username, isLoading, isEditing, showUsernameModal } = this.state;

    return (
      <main>
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={this.onSetUsernameClick}>Update Username</button>
        </div>
        {showUsernameModal && <UsernameModal 
                                username={username}
                                showModal={showUsernameModal}
                                onSetUsername={this.onSetUsername}
                                closeModal={this.closeUsernameModal} />}

        <WikiPageList
          pages={pages}
          loadPageByKey={this.loadPageByKey}
          page={currentPage} />

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
    );
  }
}

App.propTypes = {}

export default App;