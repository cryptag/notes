import React, { Component, PropTypes } from 'react';

import WikiPageLink from './WikiPageLink';

class WikiPageList extends Component {

  // shouldComponentUpdate(newProps){
  //   let { pages } = this.props;
  //   return newProps.pages !== pages;
  // }

  render(){
    let { pages, loadPageByKey, onBlankPageClick } = this.props;

    return (
      <div className="pages">
        <div className="row">
          <h3 className="pull-left">Pages</h3>
          <button className="btn btn-primary pull-right" onClick={onBlankPageClick}>+</button>
        </div>
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
