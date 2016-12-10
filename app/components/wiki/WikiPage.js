import React, { Component, PropTypes } from 'react';

const utf8 = require('utf8');
const atob = require('atob');

class WikiPage extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let { page } = this.props;
    let title = page.title || "untitled"
    let content = page.contents || ""
    content = utf8.decode(atob(content))

    return (
      <div className="wiki-page">
        <div className="page-title-bar">
          <h2>{title}</h2>
        </div>
        <p>
          {content}
        </p>
      </div>
    );
  }
}

WikiPage.propTypes = {
  page: PropTypes.object.isRequired
}

export default WikiPage;
