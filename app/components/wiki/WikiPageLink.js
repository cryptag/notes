import React, { Component, PropTypes } from 'react';

class WikiPageLink extends Component {
  constructor(props){
    super(props);
    this.onSelectPage = this.onSelectPage.bind(this);
  }

  onSelectPage(e){
    e.preventDefault();
    let { loadPageByKey, page } = this.props;
    loadPageByKey(page.key);
    return false;
  }

  render(){
    let { page } = this.props;
    let title = page.title || "untitled"

    return (
      <li>
        <a href="#" onClick={this.onSelectPage}>{title}</a>
      </li>
    );
  }
}

WikiPageLink.propTypes = {
  page: PropTypes.object.isRequired,
  loadPageByKey: PropTypes.func.isRequired
}

export default WikiPageLink;
