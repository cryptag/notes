import React, { Component } from 'react';

class WikiPage extends Component {
  onSelect(){
    let key = this.props.page.key;
    this.props.onSelectPage(key);
  }

  render(){
    console.log("this.props: ", this.props);
    let page = this.props.page;
    return (
      <li>
        <a href="#" onClick={this.onSelect.bind(this)}>{page.title || "Default Title"}</a>
      </li>
    )
  }
}

// class WikiPage extends Component {
//   render(){
//     let myUsername = this.props.myUsername;
//     let room = this.props.room;
//
//     return (
//      <div className="chatroom">
//         {(room.messages || []).map(message => {
//           let fromMe = (message.from === myUsername);
//           return (
//             <div key={message.key} className={fromMe ? 'chat-outgoing' : 'chat-incoming'}>
//               {message.from}: {message.msg}
//             </div>
//           )
//         })}
//       </div>
//     )
//   }
// }

export default WikiPage;
