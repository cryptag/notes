import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

const { dialog } = require('electron').remote;

import { Modal, Button } from 'react-bootstrap';
import DropdownList from 'react-widgets/lib/DropdownList';

class BackendModal extends Component {
  constructor(){
    super(...arguments);

    this.state = {
      bkTypeSelected: 'filesystem',
      dataPath: ''
    };

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSelectBackend = this.onSelectBackend.bind(this);
    this.onSelectDataPath = this.onSelectDataPath.bind(this);
    this.onSubmitNewBackend = this.onSubmitNewBackend.bind(this);
  }

  componentDidMount(){
    $(findDOMNode(this.refs.bk_name)).focus();
  }

  onKeyPress(e){
    if (e.which === 13){
      this.onSubmitNewBackend();
    }
  }

  onSelectBackend(bkType){
    this.setState({
      bkTypeSelected: bkType
    })
  }

  onSelectDataPath(){
    let dataPath = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    this.setState({dataPath: dataPath});
  }

  onSubmitNewBackend(e){
    let { onCreateBackend } = this.props;
    var bkConfig = {};

    let Type = this.state.bkTypeSelected;
    let Name = findDOMNode(this.refs.bk_name).value;

    switch (Type) {
      case 'filesystem':
        bkConfig = {
          Name: Name,
          Type: Type,
          DataPath: findDOMNode(this.refs.bk_data_path).value
        }
        break;
      case 'sandstorm':
        bkConfig = {
          Name: Name,
          Type: Type,
          Custom: {
            WebKey: findDOMNode(this.refs.bk_web_key).value
          }
        }
        break;
      case 'webserver':
        bkConfig = {
          Name: Name,
          Type: Type,
          Custom: {
            BaseURL: findDOMNode(this.refs.bk_base_url).value,
            AuthToken: findDOMNode(this.refs.bk_auth_token).value
          }
        }
        break;
    }

    console.log(bkConfig);

    onCreateBackend(bkConfig);
  }

  render(){
    let { showModal, onCloseModal } = this.props;
    let { bkTypeSelected, dataPath } = this.state;

    let typeFilesystem = (bkTypeSelected === "filesystem");
    let typeSandstorm = (bkTypeSelected === "sandstorm");
    let typeWebserver = (bkTypeSelected === "webserver");

    return (
      <div>
        <Modal show={showModal} onHide={onCloseModal} bsSize="large" aria-labelledby="contained-modal-title-lg" animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>New Backend</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="bk_name">Name</label>
              <input type="text" className="form-control" placeholder="Backend Name" ref="bk_name" onKeyPress={this.onKeyPress} />

              <label htmlFor="bk_type">Type</label>
              <DropdownList
                duration={0}
                data={["filesystem", "sandstorm", "webserver"]}
                defaultValue={"filesystem"}
                onSelect={this.onSelectBackend} />

              {typeFilesystem && <label htmlFor="bk_data_path">Which folder should your encrypted notes be stored in?</label>}
              {typeFilesystem && <Button style={{marginLeft: 10}} onClick={this.onSelectDataPath}>Select Folder</Button>}
              {typeFilesystem && <input type="text" key={dataPath} className="form-control" placeholder="(Optional) Full path to folder; defaults to ~/.cryptag/backends/<backend_name>" ref="bk_data_path" onKeyPress={this.onKeyPress} defaultValue={dataPath} />}

              {typeSandstorm && <label htmlFor="bk_web_key">Web Key</label>}
              {typeSandstorm && <input type="text" className="form-control" placeholder="Web Key" ref="bk_web_key" onKeyPress={this.onKeyPress} />}

              {typeWebserver && <label htmlFor="bk_base_url">Base URL</label>}
              {typeWebserver && <input type="text" className="form-control" placeholder="Base URL" ref="bk_base_url" onKeyPress={this.onKeyPress} />}
              {typeWebserver && <label htmlFor="bk_auth_token">Auth Token</label>}
              {typeWebserver && <input type="text" className="form-control" placeholder="Auth Token" ref="bk_auth_token" onKeyPress={this.onKeyPress} />}

            <Button className="btn btn-lg btn-primary" style={{marginTop: 20, marginBottom: -10}} onClick={this.onSubmitNewBackend}>Create Backend</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


BackendModal.propType = {
  onOpenModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
}

export default BackendModal;