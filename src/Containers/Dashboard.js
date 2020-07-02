import React, { Component } from "react";
// import RadarChart from "../Components/RadarChart";
import { MDBCol, MDBRow } from "mdbreact";
import Card from "../App/components/MainCard";
import RadarChart from "../Components/RadarChart";
import classes from "../CommonAssets/CommonCss/SimpleInput.module.css";
import Select from "react-select";
import Chip from "@material-ui/core/Chip";
import Image from "../CommonAssets/Images/person.png";
import { connect } from "react-redux";
import {
  fetchEmployees,
  fetchEmployeeEvaluationRecord,
  fetchCriteriasForEvaluation,
  fetchEmployeesWithCriterias,
} from "../store/actionCreators";
import { data } from "jquery";
// import { fetchProperties, fetchPlayers } from "../store/actions";
// let count;
let evaluationCriteriasData = [];

class Dashboard extends Component {
  //   state = {
  //     properties: [],
  //     players: [],
  //     player1Name: "",
  //     player1Data: [],
  //     player2Name: "",
  //     player2Data: [],
  //   };

  state = {
    isClearable: true,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: true,
    options: [],
    evaluationCategories: [],
    criteriasArray: [],
    selectedOption1: "",
    selectedOption2: "",
    emp1Name: "",
    emp2Name: "",
    emp1Data: [],
    emp2Data: [],
  };

  componentDidMount() {
    // this.props.onFetchEmployees();
    this.props.onFetchEmployeesWithCriterias();
    this.props.onFetchCriteriasForEvaluation();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    let options = [];

    nextProps.employees.map((employee) => {
      if (employee.skills != null) {
        let firstArray = employee.skills;

        firstArray = Object.keys(firstArray).map((key) => firstArray[key]);

        let secondArray = [];
        firstArray.map((el) => {
          secondArray.push(el.skill);
        });

        options.push({
          value: employee.employeeName,
          label: employee.employeeName,
          id: employee.id,
          email: employee.email,
          skills: secondArray,
        });

        this.setState({ options: options });
      } else {
        options.push({
          value: employee.employeeName,
          label: employee.employeeName,
          id: employee.id,
          email: employee.email,
        });

        this.setState({ options: options });
      }
    });

    this.setState({
      evaluationCategories: nextProps.evaluationCategories,
      criteriasArray: nextProps.criteriasArray,
    });
  };

  employee1SelectChangedHandler = (selectedOption) => {
    this.setState({
      selectedOption1: selectedOption,
    });

    if (selectedOption != null) {
      this.props.employeeCriterias.map((data) => {
        if (selectedOption.id == data.id) {
          if (data.criterias != null) {
            let criterias = [];
            for (let key in data.criterias) {
              criterias.push(data.criterias[key]);
            }
            this.setState({
              emp1Name: selectedOption.value,
              emp1Data: criterias,
            });
          }
        }
      });
    }
  };

  employee2SelectChangedHandler = (selectedOption) => {
    this.setState({
      selectedOption2: selectedOption,
    });

    if (selectedOption != null) {
      this.props.employeeCriterias.map((data) => {
        if (selectedOption.id == data.id) {
          if (data.criterias != null) {
            let criterias = [];
            for (let key in data.criterias) {
              criterias.push(data.criterias[key]);
            }
            this.setState({
              emp2Name: selectedOption.value,
              emp2Data: criterias,
            });
          }
        }
      });
    }
  };

  render() {
    return (
      <Card title="Comparison">
        <MDBRow style={{ textAlign: "center" }}>
          <MDBCol sm="2" className={classes.radarChartCard}>
            <h4 style={{ marginBottom: "20px", marginTop: "20px" }}>
              Employee 1
            </h4>
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
              options={this.state.options}
              value={this.state.selectedOption1}
              onChange={this.employee1SelectChangedHandler}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#b3e0f3",
                },
              })}
            />

            {this.state.selectedOption1 == null ||
            this.state.selectedOption1 == "" ? null : (
              <div
                className={classes.textEditorCard}
                style={{ marginTop: "20px" }}
              >
                <img
                  src={Image}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    padding: "20px",
                  }}
                />
                <div className={classes.container}>
                  <h5>
                    <b>{this.state.selectedOption1.value}</b>
                  </h5>
                  <p>{this.state.selectedOption1.email}</p>
                </div>
                <hr />
                <div
                  className={classes.container}
                  style={{ textAlign: "left" }}
                >
                  {this.state.selectedOption1.skills == null
                    ? null
                    : this.state.selectedOption1.skills.map((skill) => (
                        <Chip className={classes.Chips} label={skill} />
                      ))}
                </div>
              </div>
            )}
          </MDBCol>

          <MDBCol sm="7" className={classes.radarChartCard}>
            <div style={{ marginTop: "20px" }} className={classes.wrapper}>
              {this.state.evaluationCategories.map((data) => (
                <RadarChart
                  key={data.id}
                  idNo={data.id}
                  num={data.id}
                  category={data.category}
                  criterias={this.state.criteriasArray}
                  emp1Name={this.state.emp1Name}
                  emp2Name={this.state.emp2Name}
                  emp1Data={this.state.emp1Data}
                  emp2Data={this.state.emp2Data}
                />
              ))}
            </div>
          </MDBCol>

          <MDBCol sm="2" className={classes.radarChartCard}>
            <h4 style={{ marginBottom: "20px", marginTop: "20px" }}>
              Employee 2
            </h4>
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
              options={this.state.options}
              value={this.state.selectedOption2}
              onChange={this.employee2SelectChangedHandler}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "#b3e0f3",
                },
              })}
            />

            {this.state.selectedOption2 == null ||
            this.state.selectedOption2 == "" ? null : (
              <div
                className={classes.textEditorCard}
                style={{ marginTop: "20px" }}
              >
                <img
                  src={Image}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    padding: "20px",
                  }}
                />
                <div className={classes.container}>
                  <h5>
                    <b>{this.state.selectedOption2.value}</b>
                  </h5>
                  <p>{this.state.selectedOption2.email}</p>
                </div>
                <hr />
                <div
                  className={classes.container}
                  style={{ textAlign: "left" }}
                >
                  {this.state.selectedOption2.skills == null
                    ? null
                    : this.state.selectedOption2.skills.map((skill) => (
                        <Chip className={classes.Chips} label={skill} />
                      ))}
                </div>
              </div>
            )}
          </MDBCol>
        </MDBRow>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees,
    evaluationCategories: state.evaluationCategories,
    criteriasArray: state.criteriasArray,
    recordNum1: state.recordNum1,
    recordNum2: state.recordNum2,
    employeeCriterias: state.employeeCriterias,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEmployees: () => dispatch(fetchEmployees()),
    onFetchEmployeeEvaluationRecord: (employeeId, recordNum) =>
      dispatch(fetchEmployeeEvaluationRecord(employeeId, recordNum)),
    onFetchCriteriasForEvaluation: () =>
      dispatch(fetchCriteriasForEvaluation()),
    onFetchEmployeesWithCriterias: () =>
      dispatch(fetchEmployeesWithCriterias()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
