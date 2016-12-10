import React, { Component, PropTypes } from 'react';

import WikiPage from './WikiPage';
import WikiPageEdit from './WikiPageEdit';
import WikiPageToolbar from './WikiPageToolbar';

// TODO: Add header 1-6/bold/italics/underlined/etc bottons
//
// TODO: Add Preview tab to view page as rendered Markdown
class WikiContainer extends Component {
  updatePage(e){
    let newPageTitle = $(e.target).val();
  }

  render(){
    let { page, isLoading, isEditing, loadPageByKey } = this.props;

    return (
      <div>
        <div className="toolbar">
          <WikiPageToolbar />
        </div>
        <div className="content">
          {isLoading && "Loading..."}
          {!isEditing && <WikiPage page={page} />}
          {isEditing && <WikiPageEdit page={page} />}
        </div>
      </div>
    );
  }
}

WikiContainer.propTypes = {
  page: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
}

export default WikiContainer;
