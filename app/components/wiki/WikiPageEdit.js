import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import ReactMarkdown from 'react-markdown';
import Editor from 'react-md-editor';
import { Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

class WikiPageEdit extends Component {
  constructor(){
    super(...arguments);

    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onChangeEditMode = this.onChangeEditMode.bind(this);
    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.onUpdateTitle = this.onUpdateTitle.bind(this);
  }

  onSaveClick(e){
    // TODO: move this logic up to App.js
    // send 'save' message to App, have update / create occur 
    // by cloning from shadowPage.
    e.preventDefault();
    let { onUpdatePage, onCreatePage, page } = this.props;

    if (page.key) {
      onUpdatePage();
    } else {
      let tags = [];
      let title = $(findDOMNode(this.refs.page_title)).find('input').val();
      let content = $(findDOMNode(this.refs.page_content)).find('textarea').val();;
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
    this.props.onTogglePreviewMode(eventKey === "2" ? true : false);
  }

  onUpdateContent(newContents){
    let { shadowPage, onUpdateShadowPage } = this.props;
    let newPage = Object.assign({},
                                shadowPage,
                                {'contents': newContents });
    onUpdateShadowPage(newPage);
  }

  // if we end up with more than two fields we're updating,
  // this might become an anti-pattern.
  onUpdateTitle(event){
    event.preventDefault();
    let { shadowPage, onUpdateShadowPage } = this.props;
    let newPage = Object.assign({},
                                shadowPage,
                                {'title': event.target.value });
    onUpdateShadowPage(newPage);
  }

  render(){
    let { shadowPage, isPreviewMode } = this.props;
    let title = shadowPage.title || "";
    let content = shadowPage.contents || "";

    // TODO: Eventually make title editable, but for now it isn't, so
    // let's not mislead the user
    let readOnly = shadowPage.key ? true : false;
    let activeKey = isPreviewMode ? "2" : "1";

    let editorOptions = {lineWrapping: true};

    return (
      <div className="wiki-page wiki-page-edit">
        <form>
          <div className="toolbar">
            <button className="btn btn-primary" onClick={this.onSaveClick}>Save</button>
            <button className="btn btn-default" onClick={this.onCancelClick}>Cancel</button>
          </div>
          <div className="form-group page-title-bar" ref="page_title">
            <label>Title</label>
            <input className="form-control" value={title} placeholder="Enter page title" readOnly={readOnly} onChange={this.onUpdateTitle}/>
          </div>
          <Nav bsStyle="tabs" activeKey={activeKey} onSelect={this.onChangeEditMode}>
            <NavItem eventKey="1">Edit</NavItem>
            <NavItem eventKey="2">Preview</NavItem>
          </Nav>
          <div className="form-group page-content" ref="page_content">
            {isPreviewMode && <ReactMarkdown className="wiki-page-view" source={content} escapeHtml={true} />}
            {!isPreviewMode && <Editor className="form-control wiki-page-edit-component" value={content} onChange={this.onUpdateContent} options={editorOptions} />}
          </div>
        </form>
      </div>
    );
  }
}

WikiPageEdit.propTypes = {
  page: PropTypes.object.isRequired,
  shadowPage: PropTypes.object.isRequired,
  isPreviewMode: PropTypes.bool.isRequired,
  onTogglePreviewMode: PropTypes.func.isRequired,
  onUpdateShadowPage: PropTypes.func.isRequired,
  onUpdatePage: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired
}

export default WikiPageEdit;
