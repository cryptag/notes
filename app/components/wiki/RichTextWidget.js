import React, {Component} from 'react';
import RichTextEditor, {createEmptyValue} from 'react-rte-imagesupport';
import {convertToRaw} from 'draft-js';
import autobind from 'class-autobind';

import type {EditorValue} from 'react-rte-imagesupport';

type Props = {};

export default class RichTextWidget extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let { page, onSaveClick } = this.props;

    let title = page.title || '';
    let readOnly = page.key ? true : false;

    return (
      <div className="editor">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={onSaveClick}>Save</button>
        </div>
        <div className="form-group page-title-bar" ref="page_title">
          <label>Title</label>
          <input className="form-control" defaultValue={title} placeholder="Enter page title" readOnly={readOnly} onChange={this._onChangeTitle}/>
        </div>
        <div className="row">
          <RichTextEditor
            value={this.props.value}
            onChange={this._onChange}
            className="react-rte"
            placeholder="Tell a story"
            toolbarClassName="rte-toolbar"
            editorClassName="rte-editor"
          />
        </div>
      </div>
    );
  }

  _onChange(value: EditorValue) {
    this.props.onChange({
      contents: value
    });
  }

  _onChangeTitle(e) {
    let newTitle = e.target.value;
    this.props.onChange({
      title: newTitle
    });
  }
}
