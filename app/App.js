import React, { Component } from 'react';

import Nav from './components/layout/Nav';
import { listPages, getPages } from './data/chat/pages';
import { formatPages } from './utils/page';

import WikiPageList from './components/chat/WikiPageList';
import WikiContainer from './components/chat/WikiContainer';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentBackend: '',
      currentPage: {},
      pages: [],
      myUsername: '',
      isLoading: true
    };

    this.loadPageList = this.loadPageList.bind(this);
    this.loadPageByKey = this.loadPageByKey.bind(this);
  }

  promptForUsername(){
    // prompt function not supported
    // we'll need a custom modal or overlay of some sort.
    prompt('Username?');
  }

  componentDidMount(){
    // this.promptForUsername();
    this.loadPageList();
  }

  loadPageList(){
    // TODO: Get pages from all Backends, not just the current/default
    let backend = this.state.currentBackend;
    // console.log(backend);

    listPages(backend).then( (response) => {
      let pages = formatPages(response.body);
      this.setState({
        pages: pages,
        isLoading: false
      });

      console.log('pages');
      console.log(pages);

      /* Where should these be? */

      // this.loadPageContents(page);  // Let React components handle this
      // this.pollForPages();
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
        return
      }

      this.setState({
        currentPage: pages[0],
        isLoading: false
      });
    })
  }

  pollForPages(){
    setInterval(() => {
      // this.loadChatMessages(this.state.currentRoomKey);
      console.log("Fake-polling for new pages, or updates to the current page, or somethin'...");
    }, 5000)
  }

  render(){
    let { pages, currentPage, myUsername, isLoading } = this.state;

    return (
      <main>
        <Nav />
        {/*
        <BackendList
          backends={backends} />
         */}

        <WikiPageList
          pages={pages}
          loadPageByKey={this.loadPageByKey}/>

        {/*TODO: Add UI panel here (Bold, Italics, Underline, Heading 1, etc)*/}
        <WikiContainer
          page={currentPage}
          myUsername={myUsername}
          isLoading={isLoading}
          loadPageByKey={this.loadPageByKey}/>

      </main>
    );
  }
}
