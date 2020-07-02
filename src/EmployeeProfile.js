import React, { Component } from "react";
import Card from "./App/components/MainCard";
import { MDBCol, MDBRow, MDBAlert } from "mdbreact";
import Chip from "@material-ui/core/Chip";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import Image from "./CommonAssets/Images/person.png";
import Select from "react-select";
import { connect } from "react-redux";
import {
  fetchEmployees,
  addEmployeeToTeam,
  fetchEmployeeTeam,
  removeEmployeeFromTeam,
  fetchSkills,
  fetchEmployeeSkills,
  addEmployeeSkill,
  removeSkillFromEmployee,
} from "./store/actionCreators";

class EmployeeProfile extends Component {
  state = {
    currentUserId: "",
    selectedOption: "",
    selectedValue: "",
    selectedSkill: "",
    isClearable: true,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: true,
    alert: false,
    teamOptions: [],
    skillOptions: [],
  };

  componentDidMount() {
    this.props.onFetchEmployees();
    this.props.onFetchEmployeeTeam(this.props.location.state.detail.id);
    this.props.onFetchSkills();
    this.props.onFetchEmployeeSkills(this.props.location.state.detail.id);
    this.setState({ currentUserId: this.props.location.state.detail.id });
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    let skillOptions = [];

    let firstArray = Object.keys(nextProps.skills).map(
      (key) => nextProps.skills[key]
    );

    let secondArray = [];
    firstArray.map((name) => {
      secondArray.push({ skills: name.skills });
    });

    secondArray.map((item) => {
      for (let key in item.skills) {
        skillOptions.push({
          value: item.skills[key].skill,
          label: item.skills[key].skill,
        });
      }
    });

    this.setState({ skillOptions: skillOptions });

    let options = [];
    nextProps.employees.map((employee) => {
      if (employee.id != this.state.currentUserId) {
        options.push({
          value: employee.employeeName,
          label: employee.employeeName,
          id: employee.id,
          email: employee.email,
        });
      }
    });

    this.setState({ teamOptions: options });
  };

  removeTeamMemberHandler = (event, teamMember) => {
    event.preventDefault();
    this.props.onRemoveEmployeeFromTeam(
      this.state.currentUserId,
      teamMember.id
    );
  };

  addEmployeeToTeamHandler = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
    });
    if (selectedOption != null) {
      let optionValidity = true;

      this.props.team.map((member) => {
        optionValidity =
          member.teamMemberId != selectedOption.id && optionValidity;
      });

      if (optionValidity) {
        this.setState({ selectedValue: selectedOption.value, alert: false });
        let data = {
          teamMemberId: selectedOption.id,
          teamMemberName: selectedOption.value,
          teamMemberEmail: selectedOption.email,
        };
        this.props.onAddEmployeeToTeam(this.state.currentUserId, data);
      } else {
        this.setState({ alert: true });
        setTimeout(() => {
          this.setState({ alert: false });
        }, 2000);
      }
    }
  };

  addSkillHandler = (selectedSkill) => {
    this.setState({ selectedSkill: selectedSkill });

    if (selectedSkill != null) {
      let count = 0;
      this.props.employeeSkills.map((employeeSkill) => {
        if (employeeSkill.skill == selectedSkill.value) {
          count++;
        }
      });

      if (count == 0) {
        let skill = {
          skill: selectedSkill.value,
        };
        this.props.onAddEmployeeSkill(this.state.currentUserId, skill);
      }
    }
  };

  removeSkillHandler = (event, skillId) => {
    event.preventDefault();
    this.props.onRemoveSkillFromEmployee(this.state.currentUserId, skillId);
  };

  render() {
    return (
      <Card title="Employee Profile">
        <MDBRow>
          <MDBCol md="3">
            <div className={classes.card}>
              <img
                src={Image}
                alt="Avatar"
                style={{
                  width: "100%",
                  padding: "30px",
                }}
              />
              <div className={classes.container}>
                <h5>
                  <b>{this.props.location.state.detail.employeeName}</b>
                </h5>
                <p>{this.props.location.state.detail.email}</p>
              </div>
            </div>
          </MDBCol>
          <MDBCol
            md="4"
            style={{ textAlign: "left", marginLeft: "15px" }}
            className={classes.skillsetCard}
          >
            <h4 style={{ marginTop: "20px" }}>Skillset</h4>
            <hr />
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoading}
              isClearable={this.state.isClearable}
              isRtl={this.state.isRtl}
              isSearchable={this.state.isSearchable}
              name="color"
              options={this.state.skillOptions}
              value={this.state.selectedSkill}
              onChange={this.addSkillHandler}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#b3e0f3",
                },
              })}
            />

            {this.props.employeeSkills.map((employeeSkill) => (
              <Chip
                key={employeeSkill.id}
                style={{ marginTop: "20px" }}
                className={classes.Chips}
                label={employeeSkill.skill}
                onDelete={(event) =>
                  this.removeSkillHandler(event, employeeSkill.id)
                }
              />
            ))}
          </MDBCol>

          <MDBCol
            md="4"
            style={{ textAlign: "left", marginLeft: "30px" }}
            className={classes.skillsetCard}
          >
            <h4 style={{ marginTop: "20px" }}>Add to Team</h4>
            <hr />
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoading}
              isClearable={this.state.isClearable}
              isRtl={this.state.isRtl}
              isSearchable={this.state.isSearchable}
              name="color"
              value={this.state.selectedOption}
              onChange={this.addEmployeeToTeamHandler}
              options={this.state.teamOptions}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#b3e0f3",
                },
              })}
            />

            {this.state.alert ? (
              <div style={{ width: "100%", marginTop: "20px" }}>
                <MDBAlert color="danger" dismiss style={{ height: "5%" }}>
                  He's already in this team!
                </MDBAlert>
              </div>
            ) : null}

            {this.props.team.map((member) => {
              return (
                <Chip
                  key={member.teamMemberId}
                  style={{ marginTop: "20px" }}
                  className={classes.Chips}
                  label={member.teamMemberName}
                  onDelete={(event) =>
                    this.removeTeamMemberHandler(event, member)
                  }
                />
              );
            })}
          </MDBCol>
        </MDBRow>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees,
    team: state.team,
    skills: state.skills,
    employeeSkills: state.employeeSkills,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEmployees: () => dispatch(fetchEmployees()),
    onAddEmployeeToTeam: (employeeId, data) =>
      dispatch(addEmployeeToTeam(employeeId, data)),
    onFetchEmployeeTeam: (employeeId) =>
      dispatch(fetchEmployeeTeam(employeeId)),
    onRemoveEmployeeFromTeam: (employeeId, teamMemberId) =>
      dispatch(removeEmployeeFromTeam(employeeId, teamMemberId)),
    onFetchSkills: () => dispatch(fetchSkills()),
    onFetchEmployeeSkills: (employeeId) =>
      dispatch(fetchEmployeeSkills(employeeId)),
    onAddEmployeeSkill: (employeeId, skill) =>
      dispatch(addEmployeeSkill(employeeId, skill)),
    onRemoveSkillFromEmployee: (employeeId, skillId) =>
      dispatch(removeSkillFromEmployee(employeeId, skillId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile);
