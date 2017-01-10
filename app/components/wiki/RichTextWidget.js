import React, {Component} from 'react';
import RichTextEditor, {createEmptyValue} from 'react-rte';
import {convertToRaw} from 'draft-js';
import autobind from 'class-autobind';

import type {EditorValue} from 'react-rte';

type Props = {};
type State = {
  value: EditorValue;
  format: string;
  readOnly: boolean;
};

export default class RichTextWidget extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      value: createEmptyValue(),
      format: 'markdown',
      readOnly: false,
    };
  }

  render() {
    let {value, format} = this.state;

    return (
      <div className="editor">
        <div className="row">
          <RichTextEditor
            value={value}
            onChange={this._onChange}
            className="react-rte"
            placeholder="Tell a story"
            toolbarClassName="rte-toolbar"
            editorClassName="rte-editor"
            readOnly={this.state.readOnly}
          />
        </div>
        <div className="row">
          <textarea
            className="source"
            placeholder="Editor Source"
            value={value.toString(format)}
            onChange={this._onChangeSource}
          />
        </div>
      </div>
    );
  }

  _onChange(value: EditorValue) {
    this.setState({value});

    if (this.props.onChange) {
      this.props.onChange(
        value.toString('markdown')
      );
    }
  }

  _onChangeSource(event: Object) {
    let source = event.target.value;
    let oldValue = this.state.value;
    this.setState({
      value: oldValue.setContentFromString(source, this.state.format),
    });
  }
}
