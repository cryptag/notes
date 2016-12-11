import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

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
    e.preventDefault();
    let { onUpdatePage, page } = this.props;
    let title = $(findDOMNode(this.refs.page_title)).find('input').val();
    let content = $(findDOMNode(this.refs.page_content)).find('textarea').val();;
    onUpdatePage(page.key, title, content);
    return false;
  }

  onCancelClick(e){
    e.preventDefault();
    this.props.onCancelUpdate();
    return false;
  }

  render(){
    let { page } = this.props;
    let title = page.title || "";
    let content = page.contents || "";
    content = utf8.decode(atob(content));

    return (
      <div className="wiki-page">
        <form>
          <div className="toolbar">
            <button className="btn btn-primary" onClick={this.onSaveClick}>Save</button>
            <button className="btn btn-default" onClick={this.onCancelClick}>Cancel</button>
          </div>
          <div className="form-group page-title-bar" ref="page_title">
            <label>Page Title</label>
            <input className="form-control" defaultValue={title} placeholder="Enter page title" />
          </div>
          <div className="form-group page-content" ref="page_content">
            <label>Content</label>
            <textarea className="form-control" defaultValue={content}></textarea>
          </div>
        </form>
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
