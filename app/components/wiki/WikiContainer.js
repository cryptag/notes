import React, { Component, PropTypes } from 'react';

import WikiPage from './WikiPage';

// TODO: Add header 1-6/bold/italics/underlined/etc bottons
//
// TODO: Add Preview tab to view page as rendered Markdown
class WikiContainer extends Component {
  updatePage(e){
    let newPageTitle = $(e.target).val();
  }

  render(){
    let { page, isLoading, isEditing } = this.props;

    return (
      <div>
        {isLoading && "Loading..." }
        {!isLoading && <WikiPage page={page} isEditing={isEditing} />}
      </div>
    );
  }
}

WikiContainer.propTypes = {
  page: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isEditing: PropTypes.bool
}

export default WikiContainer;
