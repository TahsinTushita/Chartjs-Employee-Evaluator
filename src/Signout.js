import React, { Component } from "react";
import { connect } from "react-redux";
import { signout } from "./store/actionCreators";
import { Redirect } from "react-router-dom";

class Signout extends Component {
  componentDidMount() {
    this.props.onSignout();
  }

  render() {
    return <Redirect to="/auth/signin-1" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignout: () => dispatch(signout()),
  };
};

export default connect(null, mapDispatchToProps)(Signout);
