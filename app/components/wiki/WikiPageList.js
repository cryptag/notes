import React, { Component, PropTypes } from 'react';

import WikiPageLink from './WikiPageLink';

class WikiPageList extends Component {

  render(){
    let { pages, loadPageByKey } = this.props;

    return (
      <div className="pages">
        <h3>Pages</h3>

        <ul>
          {pages.map( (page) => {
            return (
              <WikiPageLink
                key={page.key}
                page={page}
                loadPageByKey={loadPageByKey} />
            )
          })}
        </ul>
      </div>
    );
  }
}

WikiPageList.propTypes = {
  pages: PropTypes.array.isRequired,
  loadPageByKey: PropTypes.func.isRequired
}

export default WikiPageList;
