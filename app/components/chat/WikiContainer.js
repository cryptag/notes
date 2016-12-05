import React, { Component, PropTypes } from 'react';

import WikiPage from './WikiPage';

// TODO: Add header 1-6/bold/italics/underlined/etc bottons
//
// TODO: Add Preview tab to view page as rendered Markdown
class WikiContainer extends Component {
  render(){
    let { currentPage, page, isLoading, loadPageByKey } = this.props;

    return (
      <div className="content">
        {isLoading && "Loading..."}
        <WikiPage
          currentPage={currentPage}
          page={page}
          loadPageByKey={loadPageByKey} />
      </div>
    );
  }
}

WikiContainer.propTypes = {
  currentPage: PropTypes.object,
  page: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
}

export default WikiContainer;
