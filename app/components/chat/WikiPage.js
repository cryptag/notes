import React, { Component, PropTypes } from 'react';

class WikiPage extends Component {
  constructor(props){
    super(props);
    this.onSelectPage = this.onSelectPage.bind(this);
  }

  onSelectPage(e){
    let { loadPageByKey, page } = this.props;
    loadPageByKey(page.key);
  }

  render(){
    let { page } = this.props;

    return (
      <li>
        <a href="#" onClick={this.onSelectPage}>{page.title || "Default Title"}</a>
      </li>
    );
  }
}

WikiPage.propTypes = {
  page: PropTypes.object.isRequired,
  loadPageByKey: PropTypes.func.isRequired
}

export default WikiPage;
