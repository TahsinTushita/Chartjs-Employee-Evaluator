import React, { Component } from "react";
import Card from "./App/components/MainCard";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import { MDBIcon } from "mdbreact";
import Select from "react-select";
import { connect } from "react-redux";
import { fetchUser } from "./store/actionCreators";

class Team extends Component {
  state = {
    number: [0, 1, 2, 3, 4, 5],
    isClearable: true,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: true,
    selectedOption: "",
    selectedValue: "",
    teamOptions: [],
  };

  componentDidMount() {
    this.props.onFetchUser(this.props.email);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    let options = [];
    nextProps.team.map((member) => {
      options.push({
        value: member.teamMemberName,
        label: member.teamMemberName,
        id: member.teamMemberId,
        email: member.teamMemberEmail,
      });
    });

    this.setState({ teamOptions: options });
  };

  clickHandler = (event, teamMember) => {
    this.props.history.push({
      pathname: "/teamMemberProfile",
      state: { detail: teamMember },
    });
  };

  selectChangedHandler = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
    });
    if (selectedOption != null) {
      this.setState({ selectedValue: selectedOption.value });
    }
  };

  render() {
    return (
      <Card title="Team">
        <div style={{ display: "flex" }}>
          <div style={{ marginTop: "5px" }}>
            <MDBIcon icon="search" />
          </div>
          <div style={{ width: "30%", marginLeft: "15px" }}>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoading}
              isClearable={this.state.isClearable}
              isRtl={this.state.isRtl}
              isSearchable={this.state.isSearchable}
              name="color"
              options={this.state.teamOptions}
              value={this.state.selectedOption}
              onChange={this.selectChangedHandler}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#b3e0f3",
                },
              })}
            />
          </div>
        </div>
        <hr />

        {this.state.selectedOption == null || this.state.selectedOption == ""
          ? this.props.team.map((member) => {
              return (
                <div
                  className={classes.Employees}
                  onClick={(event) => this.clickHandler(event, member)}
                  key={member.teamMemberId}
                >
                  {/* <h4>ID</h4> */}
                  <h6>{member.teamMemberName}</h6>
                  <p>{member.teamMemberEmail}</p>
                </div>
              );
            })
          : this.props.team.map((member) => {
              return this.state.selectedValue == member.teamMemberName ? (
                <div
                  className={classes.Employees}
                  onClick={(event) => this.clickHandler(event, member)}
                  key={member.teamMemberId}
                >
                  {/* <h4>ID</h4> */}
                  <h6>{member.teamMemberName}</h6>
                  <p>{member.teamMemberEmail}</p>
                </div>
              ) : null;
            })}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    team: state.team,
    email: state.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUser: (email) => dispatch(fetchUser(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Team);
