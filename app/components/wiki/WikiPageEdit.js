import React, { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

const utf8 = require('utf8');
const atob = require('atob');


class WikiPageEdit extends Component {
  constructor(){
    super(...arguments);

    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
  }

  onSaveClick(e){
    let { onUpdatePage, page } = this.props;
    let title = page.title;
    let content = page.contents;
    onUpdatePage(page.key, title, content);
  }

  onCancelClick(e){
    this.props.onCancelUpdate();
  }

  render(){
    let { page } = this.props;
    let title = page.title || "";
    let content = page.contents || "";
    content = utf8.decode(atob(content));

    return (
      <div className="wiki-page">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={this.onSaveClick}>Save</button>
          <button className="btn btn-default" onClick={this.onCancelClick}>Cancel</button>
        </div>
        <div className="page-title-bar">
          <input defaultValue={title} placeholder="Enter page title" refs="page_title" />
        </div>
        <div className="page-content">
          <textarea defaultValue={content}></textarea>
        </div>
      </div>
    );
  }
}

WikiPageEdit.propTypes = {
  page: PropTypes.object.isRequired,
  onUpdatePage: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired
}

export default WikiPageEdit;
