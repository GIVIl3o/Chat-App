import React from "react";
import { connect } from "react-redux";

class ProfileImage extends React.Component {
  defaultImageUrl =
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";

  state = {
    src: ""
  };

  profileChange = () => {
    //Date.now is required for react re-render on image update
    this.setState({ src: `/profiles/${this.props.username}?${Date.now()}` });
    this.forceUpdate();
  };

  componentDidMount() {
    this.props.socket.on(
      `ChangeProfile#${this.props.username}`,
      this.profileChange
    );
    this.setState({ src: `/profiles/${this.props.username}?${Date.now()}` });
  }

  componentWillUnmount() {
    this.props.socket.removeListener(
      `ChangeProfile#${this.props.username}`,
      this.profileChange
    );
  }

  render() {
    return (
      <img
        src={this.state.src}
        alt="Profile"
        className={this.props.className}
        onError={() => this.setState({ src: this.defaultImageUrl })}
      />
    );
  }
}

const mapProps = ({ socket }) => ({
  socket: socket.socket
});

export default connect(mapProps)(ProfileImage);
