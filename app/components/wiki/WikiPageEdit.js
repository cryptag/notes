import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

class WikiPageEdit extends Component {
  constructor(){
    super(...arguments);

    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onChangeEditMode = this.onChangeEditMode.bind(this);
  }

  onSaveClick(e){
    e.preventDefault();
    let { onUpdatePage, onCreatePage, page } = this.props;
    let title = $(findDOMNode(this.refs.page_title)).find('input').val();
    let content = $(findDOMNode(this.refs.page_content)).find('textarea').val();;

    if (page.key) {
      // Page already exists, and we're updating it
      onUpdatePage(page.key, title, content);
    } else {
      let tags = [];
      // TODO: Allow user to set custom tags
      onCreatePage(title, content, tags);
    }

    return false;
  }

  onCancelClick(e){
    e.preventDefault();
    this.props.onCancelUpdate();
    return false;
  }

  onChangeEditMode(eventKey){
    console.log(eventKey);
  }

  render(){
    let { page } = this.props;
    let title = page.title || "";
    let content = page.contents || "";

    // TODO: Eventually make title editable, but for now it isn't, so
    // let's not mislead the user
    let readOnly = page.key ? true : false;

    return (
      <div className="wiki-page wiki-page-edit">
        <form>
          <div className="toolbar">
            <button className="btn btn-primary" onClick={this.onSaveClick}>Save</button>
            <button className="btn btn-default" onClick={this.onCancelClick}>Cancel</button>
          </div>
          <div className="form-group page-title-bar" ref="page_title">
            <label>Page Title</label>
            <input className="form-control" defaultValue={title} placeholder="Enter page title" readOnly={readOnly} />
          </div>
          <Nav bsStyle="tabs" activeKey="1" onSelect={this.onChangeEditMode}>
            <NavItem eventKey="1">Edit</NavItem>
            <NavItem eventKey="2">Preview</NavItem>
          </Nav>
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
