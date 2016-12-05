import React, { Component } from 'react';

import WikiPage from './WikiPage';

class WikiPageList extends Component {

  render(){
    let allChannels = [
      {
        key: 'channel1',
        name: "Word Green Fund",
        pages: []
      }
    ];

    return (
      <div className="pages">
        <div className="create">
          <i className="fa fa-plus-circle"></i>
        </div>
        <h2>All Backchannels</h2>

        <ul>
          {allChannels.map( (channel) => {
            return <li key={channel.key}>
              <i className="fa fa-globe"></i>
              <span className="name">{channel.name}</span>

              <ul className="chat">
                {channel.pages.map( (page) => {
                  return (
                    <WikiPage
                      key={page.key}
                      page={page}
                      onSelectPage={this.props.onSelectPage}/>
                  )
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
    );
  }
}

export default WikiPageList;
