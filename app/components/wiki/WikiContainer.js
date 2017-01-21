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
    let { page, shadowPage, onUpdateShadowPage, isEditing, onEditPage, onSaveClick, onCancelClick } = this.props;
    let { isPreviewMode, onTogglePreviewMode } = this.props;

    return (
      <div>
        {!isEditing && <WikiPage page={page} onEditPage={onEditPage} />}
        {isEditing && <WikiPageEdit page={page}
                        shadowPage={shadowPage}
                        isPreviewMode={isPreviewMode}
                        onTogglePreviewMode={onTogglePreviewMode}
                        onUpdateShadowPage={onUpdateShadowPage}
                        onCancelClick={onCancelClick}
                        onSaveClick={onSaveClick} />}
      </div>
    );
  }
}

WikiContainer.propTypes = {
  page: PropTypes.object.isRequired,
  shadowPage: PropTypes.object.isRequired,
  onUpdateShadowPage: PropTypes.func.isRequired,
  isPreviewMode: PropTypes.bool.isRequired,
  onTogglePreviewMode: PropTypes.func.isRequired,
  onEditPage: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  isEditing: PropTypes.bool
}

export default WikiContainer;
