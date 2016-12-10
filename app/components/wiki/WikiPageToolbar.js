import React, { Component, PropTypes } from 'react';

class WikiPageToolbar extends Component {
  constructor(props){
    super(props);

    this.onEditClick = this.onEditClick.bind(this);
  }

  onEditClick(e){
    e.preventDefault();
    console.log('let us edit');
    return false;
  }

  render(){
    let { isEditing } = this.props;

    return (
      <div>
        <button className="btn btn-primary" onClick={this.onEditClick}>Edit</button>
      </div>
    );
  }
}

WikiPageToolbar.propTypes = {
}

export default WikiPageToolbar;
