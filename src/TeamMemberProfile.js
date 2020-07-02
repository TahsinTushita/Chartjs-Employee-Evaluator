import React, { Component } from "react";
import Card from "./App/components/MainCard";
import { MDBCol, MDBRow, MDBBtn } from "mdbreact";
import Chip from "@material-ui/core/Chip";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import Image from "./CommonAssets/Images/person.png";
import List from "./CommonAssets/Images/list.png";
import { fetchEmployeeSkills } from "./store/actionCreators";
import { connect } from "react-redux";

class TeamMemberProfile extends Component {
  state = {
    teamMember: {},
  };

  componentDidMount() {
    this.props.onFetchEmployeeSkills(
      this.props.location.state.detail.teamMemberId
    );
    this.setState({ teamMember: this.props.location.state.detail });
  }

  evaluateClickHandler = () => {
    let data = {
      member: this.state.teamMember,
      skills: this.props.employeeSkills,
    };
    this.props.history.push({
      pathname: "/evaluation",
      state: { detail: data },
    });
  };

  render() {
    return (
      <Card title="Team Member Profile">
        <MDBRow>
          <MDBCol md="4">
            <div className={classes.textEditorCard}>
              <MDBRow>
                <MDBCol sm="5">
                  <img
                    src={Image}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      // padding: "30px",
                      marginTop: "20px",
                      marginLeft: "40px",
                    }}
                  />
                </MDBCol>
                <MDBCol
                  sm="7"
                  style={{
                    textAlign: "left",
                  }}
                >
                  <div style={{ marginLeft: "40px", marginTop: "80px" }}>
                    <h5>
                      <b>{this.props.location.state.detail.teamMemberName}</b>
                    </h5>
                    <p>{this.props.location.state.detail.teamMemberEmail}</p>
                  </div>
                </MDBCol>
              </MDBRow>
              <hr />
              <div
                className={classes.container}
                style={{ textAlign: "left", marginLeft: "20px" }}
              >
                {this.props.employeeSkills.map((empSkill) => (
                  <Chip
                    key={empSkill.id}
                    className={classes.Chips}
                    label={empSkill.skill}
                  />
                ))}
              </div>
            </div>
          </MDBCol>
          <MDBCol md="4">
            <MDBBtn
              color="primary"
              style={{ marginTop: "30px" }}
              onClick={this.evaluateClickHandler}
              style={{ width: "100%", height: "100%", fontSize: "50px" }}
            >
              <img
                src={List}
                alt="Avatar"
                style={{
                  width: "50%",
                }}
              />
              Evaluate
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employeeSkills: state.employeeSkills,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEmployeeSkills: (employeeId) =>
      dispatch(fetchEmployeeSkills(employeeId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMemberProfile);
