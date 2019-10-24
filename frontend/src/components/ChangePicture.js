import React from "react";
import { connect } from "react-redux";
import { SET_USER_MESSAGE } from "../redux/actionTypes";

class ChangePicture extends React.Component {
  state = {
    disabled: false
  };

  updateImage = event => {
    const type = event.target.files[0].type;
    if (!type.startsWith("image")) {
      this.props.dispatch({
        type: SET_USER_MESSAGE,
        success: false,
        message: "File must be an image"
      });
      setTimeout(() => {
        this.props.dispatch({
          type: SET_USER_MESSAGE,
          success: false,
          message: ""
        });
      }, 3000);
      return;
    }

    let fileReader = new FileReader();

    fileReader.readAsArrayBuffer(event.target.files[0]);

    fileReader.onload = () => {
      this.setState({ canChange: true });
      this.props.socket.emit(
        "changePicture",
        {
          jwt: this.props.jwt,
          image: fileReader.result
        },
        response => {
          if (response.profileChanged) this.setState(this.state);
          this.setState({ canChange: false });
        }
      );
    };
  };

  render() {
    return (
      <div>
        <button className="setProfile" disabled={this.state.canChange}>
          <label htmlFor="image-upload" className="change-image">
            Change Picture
          </label>
        </button>
        <input
          type="file"
          id="image-upload"
          onChange={this.updateImage}
          value=""
        />
      </div>
    );
  }
}

const mapState = ({ self, socket }) => ({
  jwt: self.jwt,
  socket: socket.socket
});

export default connect(mapState)(ChangePicture);
