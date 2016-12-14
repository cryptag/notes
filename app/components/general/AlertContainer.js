import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { Alert } from 'react-bootstrap';

class AlertContainer extends Component {
  constructor(){
    super(...arguments);

    this.onAlertDismiss = this.onAlertDismiss.bind(this);
  }

  onAlertDismiss(e){
    let alertContainer = $(findDOMNode(this.refs.alert_container));
    let { onHideAlert } = this.props;
    debugger
    alertContainer.slideUp({
      'duration': 400,
      'complete': onHideAlert
    });

    return false;
  }

  render(){
    let { autodismiss, showAlert, message, alertStyle } = this.props;
    if (['success', 'error', 'warning'].indexOf(alertStyle) === -1){
      alertStyle = 'success';
    }

    if (autodismiss){
      setTimeout(() => this.onAlertDismiss(), 3000);
    }

    return (
      <div className="alert-container" ref="alert_container">
        {showAlert && <Alert bsStyle={alertStyle} onDismiss={this.onAlertDismiss}>
          {message}
        </Alert>}
      </div>  
    );
  }
}

AlertContainer.propTypes = {
  message: PropTypes.string.isRequired,
  onHideAlert: PropTypes.func.isRequired,
  autodismiss: PropTypes.bool,
  showAlert: PropTypes.bool,
  alertStyle: PropTypes.string
}

export default AlertContainer;