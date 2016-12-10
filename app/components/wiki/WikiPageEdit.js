import React, { Component, PropTypes } from 'react';

class WikiPageEdit extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let { page } = this.props;
    let title = page.title || "untitled"
    let content = page.contents || ""

    return (
      <div className="wiki-page">
        <div className="page-title-bar">
          <input type="text" value={title} />
        </div>
        <p>
          <textarea>
            {content}
          </textarea>
        </p>
      </div>
    );
  }
}

WikiPageEdit.propTypes = {
  page: PropTypes.object.isRequired
}

export default WikiPageEdit;
