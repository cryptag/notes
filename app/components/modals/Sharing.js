import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { Modal, Button } from 'react-bootstrap';

class SharingModal extends Component {
  constructor(){
    super(...arguments);

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSubmitInviteLink = this.onSubmitInviteLink.bind(this);
  }

  componentDidMount(){
    $(findDOMNode(this.refs.invite_url)).focus();
  }

  onKeyPress(e){
    if (e.which === 13){
      this.onSubmitInviteLink();
    }
  }

  onSubmitInviteLink(e){
    let { onSubmitInviteLink } = this.props;
    let inviteURL = $(findDOMNode(this.refs.invite_url)).val();

    if (!inviteURL){
      alert("Invalid invite URL!");
    } else {
      onSubmitInviteLink(inviteURL);
    }
  }

  render(){
    let { showModal, onCloseModal } = this.props;

    return (
      <div>
        <Modal show={showModal} onHide={onCloseModal} bsSize="large" aria-labelledby="contained-modal-title-lg" animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Sharing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex-label-element">
              <input type="text" className="form-control" style={{marginRight: 10}} placeholder="enter invite URL" ref="invite_url" onKeyPress={this.onKeyPress} />
              <Button onClick={this.onSubmitInviteLink} bsStyle="primary">Accept Invite</Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/*<Button onClick={onCloseModal}>Close</Button>*/}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


SharingModal.propType = {
  onOpenModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
}

export default SharingModal;