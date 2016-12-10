import React, { Component, PropTypes } from 'react';

import WikiPage from './WikiPage';
import WikiPageEdit from './WikiPageEdit';

// TODO: Add header 1-6/bold/italics/underlined/etc bottons
//
// TODO: Add Preview tab to view page as rendered Markdown
class WikiContainer extends Component {
  updatePage(e){
    let newPageTitle = $(e.target).val();
  }

  render(){
    let { page, isEditing, onEditPage, onUpdatePage, onCancelUpdate } = this.props;

    return (
      <div>
        {!isEditing && <WikiPage page={page} onEditPage={onEditPage} />}
        {isEditing && <WikiPageEdit page={page} onUpdatePage={onUpdatePage} onCancelUpdate={onCancelUpdate} />}
      </div>
    );
  }
}

WikiContainer.propTypes = {
  page: PropTypes.object.isRequired,
  onEditPage: PropTypes.func.isRequired,
  onUpdatePage: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool
}

export default WikiContainer;
