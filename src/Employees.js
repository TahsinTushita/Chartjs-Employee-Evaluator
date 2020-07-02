import React, { Component } from "react";
import Card from "./App/components/MainCard";
import { MDBIcon } from "mdbreact";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import Select from "react-select";
import { connect } from "react-redux";
import { fetchEmployees } from "./store/actionCreators";

class Employees extends Component {
  state = {
    isClearable: true,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: true,
    selectedOption: "",
    selectedValue: "",
    options: [],
  };

  componentDidMount() {
    this.props.onFetchEmployees();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    let options = [];
    nextProps.employees.map((employee) => {
      options.push({
        value: employee.employeeName,
        label: employee.employeeName,
      });
    });

    this.setState({ options: options });
  };

  clickHandler = (event, employee) => {
    this.props.history.push({
      pathname: "/employeeProfile",
      state: { detail: employee },
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
      <Card title="Employees">
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
              options={this.state.options}
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
          ? this.props.employees.map((employee) => {
              return (
                <div
                  className={classes.Employees}
                  onClick={(event) => this.clickHandler(event, employee)}
                  key={employee.id}
                >
                  {/* <h4>ID</h4> */}
                  <h6 style={{ color: "#7CB9E8" }}>{employee.employeeName}</h6>
                  <p>{employee.email}</p>
                </div>
              );
            })
          : this.props.employees.map((employee) => {
              return this.state.selectedValue == employee.employeeName ? (
                <div
                  className={classes.Employees}
                  onClick={(event) => this.clickHandler(event, employee)}
                  key={employee.id}
                >
                  {/* <h4>ID</h4> */}
                  <h6 style={{ color: "#7CB9E8" }}>{employee.employeeName}</h6>
                  <p>{employee.email}</p>
                </div>
              ) : null;
            })}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEmployees: () => dispatch(fetchEmployees()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
