import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/filemgmt'
import { Segment, Button, Icon, Divider, Dimmer, Loader } from 'semantic-ui-react'

let selectedStyles = {
  'upload_wrapper' : {
    'color' : 'teal',
    fontWeight : 'bold',
    verticalAlign : 'text-center',
    paddingBottom : '4%'
  }
}

const colors = {
  'INACTIVE' : 'blue',
  'UPLOADING' : 'yellow',
  'UPLOADED' : 'green',
  'ERROR' : 'orange',
}

const button_text = {
  'INACTIVE' : 'Upload!',
  'UPLOADING' : 'Uploading...',
  'UPLOADED' : 'Uploaded!',
  'ERROR' : 'Error!'
}

class SelectedFileShowComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadStatus : props.uploadStatus
    }
    this.initiateUpload.bind(this);
  }

  initiateUpload() {
    let that = this;
    this.props.uploadFile(this.props.filemgmt.currentDir, this.props.file, function(err, res) {
      if (err) {
        alert(res);
        that.setState({uploadStatus : 'ERROR'});
      } else {
        that.setState({uploadStatus : 'UPLOADED'});
      }
      that.props.readFolder(that.props.filemgmt.currentDir);
    });
  }

  handleUploadClick() {
    if (this.state.uploadStatus === 'INACTIVE') {
      this.setState({uploadStatus : 'UPLOADING'})
    }
  }

  handleDeleteClick() {
    let uploadableFiles = this.props.filemgmt.uploadableFiles;
    uploadableFiles.splice(uploadableFiles.indexOf(this.props.file), 1);
    this.props.updateUploadableFiles(uploadableFiles);
  }

  hide() {
    this.setState({hidden : true});
  }

  componentWillReceiveProps(newProps) {
    if (newProps.uploadStatus !== this.props.uploadStatus && this.state.uploadStatus !== 'UPLOADED') {
      this.setState({uploadStatus : newProps.uploadStatus})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let data_target = null;
      if (prevProps.uploadStatus !== this.props.uploadStatus && prevProps.uploadStatus !== 'UPLOADED') {
        data_target = this.props.uploadStatus;
    } else if (prevState.uploadStatus !== this.state.uploadStatus && prevState.uploadStatus !== 'UPLOADED') {
        data_target = this.state.uploadStatus;
    }
    switch (data_target) {
      case 'INACTIVE':
          break;

      case 'UPLOADING':
          this.initiateUpload();
          break;

      case 'UPLOADED':
          break;

      case 'ERROR' :
          break;

      default :
          break;
    }
  }


  renderSelectedFileShowComponent() {
    let isUploading = this.state.uploadStatus === "UPLOADING"
    return (
      <div>
          {/*this.state.uploadStatus === "UPLOADING" ? <Dimmer inverted active><Loader active /></Dimmer> : null*/}
          <span style={selectedStyles.upload_wrapper}>{this.props.file.name}</span>
          <span style={{float : 'right'}}>
            <Button.Group>
                <Button
                    basic
                    icon='upload'
                    color={colors[this.state.uploadStatus]}
                    loading={isUploading}
                    onClick={this.handleUploadClick.bind(this)}>
                </Button>

                <Button
                    basic
                    icon='repeat'
                    corner='repeat'
                    color='blue'
                    onClick={this.initiateUpload.bind(this)}
                    disabled={button_text[this.state.uploadStatus] !== 'Uploaded!'}>
                </Button>

                <Button
                    basic
                    icon='cancel'
                    color='red'
                    onClick={this.handleDeleteClick.bind(this)}>
                </Button>
            </Button.Group>
          </span>
          <br/>
          <br/>
          <Divider></Divider>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderSelectedFileShowComponent()}
      </div>
    )
  }
}

function mapStateToProps({ filemgmt }) {
  return { filemgmt }
}

export default connect(mapStateToProps, actions)(SelectedFileShowComponent);
