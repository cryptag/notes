import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import ReactMarkdown from 'react-markdown';
import Editor from 'react-md-editor';
import { Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

class WikiPageEdit extends Component {
  constructor(){
    super(...arguments);

    this.onChangeEditMode = this.onChangeEditMode.bind(this);
    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.onUpdateTitle = this.onUpdateTitle.bind(this);
  }

  componentDidMount(){
    // By default, title has focus
    $(findDOMNode(this.refs.page_title)).find('input').focus();

    let {isPreviewMode, shadowPage } = this.props;

    this.props.onTogglePreviewMode(isPreviewMode);

    // ...but if the title already set, the body should get focus
    if (!isPreviewMode && shadowPage.key){
      $('.MDEditor_editor .CodeMirror').find('textarea').focus();
    }

    // Let user <tab> directly from note title to body without
    // focusing on the editor toolbar buttons in between. This jQuery
    // hack is Seemingly necessary since we can't directly set
    // attributes on child elements of <Editor /> AFAICT.
    $('.MDEditor_toolbarButton').attr('tabindex', -1);
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
    let { shadowPage, isPreviewMode, saveSuccess, onSaveClick, onCancelClick, onDeleteClick } = this.props;
    let title = shadowPage.title || "";
    let content = shadowPage.contents || "";

    // TODO: Eventually make title editable, but for now it isn't, so
    // let's not mislead the user
    let readOnly = shadowPage.key ? true : false;
    let activeKey = isPreviewMode ? "2" : "1";

    let editorOptions = {lineWrapping: true, tabSize: 4};
    // TODO: Figure out why `indentWithTabs: false` isn't changing anything

    return (
      <div className="wiki-page wiki-page-edit">
        <form>
          <div className="toolbar">
            {shadowPage.key && <button className="btn btn-primary-dangerous" onClick={onDeleteClick}>Delete</button>}
            {!saveSuccess && <button className="btn btn-primary" onClick={onSaveClick}>Save</button>}
            {saveSuccess && <button className="btn btn-primary-success" onClick={onSaveClick}>Saved!</button>}
            <button className="btn btn-default" onClick={onCancelClick}>Cancel</button>
          </div>
          <div className="form-group page-title-bar" ref="page_title">
            <input className="form-control" value={title} placeholder="Enter note title" readOnly={readOnly} onChange={this.onUpdateTitle}/>
          </div>
          <Nav bsStyle="tabs" activeKey={activeKey} onSelect={this.onChangeEditMode}>
            <NavItem tabIndex="-1" eventKey="1">Edit</NavItem>
            <NavItem tabIndex="-1" eventKey="2">Preview</NavItem>
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
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired
}

export default WikiPageEdit;
