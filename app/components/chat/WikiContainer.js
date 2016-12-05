import React, { Component } from 'react';

import WikiPage from './WikiPage';

// TODO: Add header 1-6/bold/italics/underlined/etc bottons
//
// TODO: Add Preview tab to view page as rendered Markdown
class WikiContainer extends Component {
  render(){
    return (
      <div className="content">
        <WikiPage
          currentPage={this.props.currentPage}
          page={this.props.page}
          isLoading={this.props.isLoading} />
      </div>
    );
  }
}

export default WikiContainer;
