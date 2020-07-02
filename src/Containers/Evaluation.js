import React, { Component } from "react";
import { MDBBtn, MDBCol, MDBRow, MDBAlert } from "mdbreact";
import Card from "../App/components/MainCard";
import classes from "../CommonAssets/CommonCss/SimpleInput.module.css";
import Select from "react-select";
import RadarChartEvaluationPage from "../Components/RadarChartEvaluationPage";
import Image from "../CommonAssets/Images/person.png";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
// import { Editor } from "@tinymce/tinymce-react";
import { connect } from "react-redux";
import {
  fetchUser,
  fetchEmployees,
  fetchCriteriasForEvaluation,
  evaluateEmployee,
  fetchEvaluatedList,
  fetchEmployeeEvaluationRecord,
} from "../store/actionCreators";

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
  root: {
    // color: "#52af77",
    color: "#72bcd4",
    height: 8,
    width: 420,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

class Evaluation extends Component {
  state = {
    isClearable: true,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
    isSearchable: true,
    selectedOption: "",
    category: "",
    criteria: "",
    evaluationCategories: [],
    criteriasArray: [],
    memberOptions: [],
    evaluateNum: 0,
    note: "",
    alert: false,
    message: "",
    alertColor: "",
  };

  componentDidMount() {
    this.props.onFetchUser(this.props.email);
    this.props.onFetchEmployees();
    this.props.onFetchCriteriasForEvaluation();
    this.props.onFetchEvaluatedList(this.props.userId);
    if (this.props.location.state != null) {
      this.props.onFetchEmployeeEvaluationRecord(
        this.props.location.state.detail.member.teamMemberId
      );
      this.setState({ evaluateNum: 1 });
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    let options = [];
    nextProps.team.map((member) => {
      nextProps.employees.map((employee) => {
        if (member.teamMemberName == employee.employeeName) {
          if (employee.skills != null) {
            let firstArray = employee.skills;

            firstArray = Object.keys(firstArray).map((key) => firstArray[key]);

            let secondArray = [];
            let count = 0;
            firstArray.map((el) => {
              secondArray.push({ id: count, skill: el.skill });
              count++;
            });

            if (member.evaluationCriterias == null) {
              options.push({
                value: member.teamMemberName,
                label: member.teamMemberName,
                id: member.teamMemberId,
                email: member.teamMemberEmail,
                skills: secondArray,
              });
            } else {
              options.push({
                value: member.teamMemberName,
                label: member.teamMemberName,
                id: member.teamMemberId,
                email: member.teamMemberEmail,
                skills: secondArray,
              });
            }
          } else {
            if (member.evaluationCriterias == null) {
              options.push({
                value: member.teamMemberName,
                label: member.teamMemberName,
                id: member.teamMemberId,
                email: member.teamMemberEmail,
              });
            } else {
              options.push({
                value: member.teamMemberName,
                label: member.teamMemberName,
                id: member.teamMemberId,
                email: member.teamMemberEmail,
              });
            }
          }
        }
      });
    });
    this.setState({ memberOptions: options });

    this.setState({
      evaluationCategories: nextProps.evaluationCategories,
      criteriasArray: nextProps.criteriasArray,
    });
  };

  selectChangedHandler = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
    });
    if (selectedOption != null) {
      this.props.onFetchEmployeeEvaluationRecord(selectedOption.id);
      this.setState({ evaluateNum: 2 });
    } else {
      this.setState({ evaluateNum: 0 });
    }
  };

  sliderChangedHandler = (event, value, el) => {
    event.preventDefault();
    let array = [...this.state.criteriasArray];
    array.map((data) => {
      if (el.id == data.id) {
        data.value = value;
      }
    });
    this.setState({ criteriasArray: array });
  };

  // handleEditorChange = (content, editor) => {
  //   console.log("Content was updated:", content);
  // };

  evaluateEmployeeHandler = (event) => {
    event.preventDefault();

    if (this.state.evaluateNum == 1) {
      if (this.props.evaluatedList != null) {
        let count = 0;
        this.props.evaluatedList.map((el) => {
          if (
            el.evaluatedEmployeeId ==
            this.props.location.state.detail.member.teamMemberId
          ) {
            count++;
          }
        });

        if (count < 1) {
          this.props.onEvaluateEmployee(
            this.props.location.state.detail.member.teamMemberId,
            this.props.record,
            this.state.evaluationCategories,
            this.state.criteriasArray,
            this.state.note,
            this.props.userId
          );
          this.setState({
            alert: true,
            message: "Evaluation will be added",
            alertColor: "success",
          });
          setTimeout(() => {
            this.setState({ alert: false, message: "", alertColor: "" });
          }, 2000);
        } else {
          this.setState({
            alert: true,
            message: "You evaluated him before",
            alertColor: "danger",
          });
          setTimeout(() => {
            this.setState({ alert: false, message: "", alertColor: "" });
          }, 2000);
        }
      } else {
        this.props.onEvaluateEmployee(
          this.props.location.state.detail.member.teamMemberId,
          this.props.record,
          this.state.evaluationCategories,
          this.state.criteriasArray,
          this.state.note,
          this.props.userId
        );
        this.setState({
          alert: true,
          message: "Evaluation will be added",
          alertColor: "success",
        });
        setTimeout(() => {
          this.setState({ alert: false, message: "", alertColor: "" });
        }, 2000);
      }
    } else if (this.state.evaluateNum == 2) {
      let count = 0;
      if (this.props.evaluatedList != null) {
        this.props.evaluatedList.map((el) => {
          if (el.evaluatedEmployeeId == this.state.selectedOption.id) {
            count++;
          }
        });

        if (count < 1) {
          this.props.onEvaluateEmployee(
            this.state.selectedOption.id,
            this.props.record,
            this.state.evaluationCategories,
            this.state.criteriasArray,
            this.state.note,
            this.props.userId
          );
          this.setState({
            alert: true,
            message: "Evaluation will be added",
            alertColor: "success",
          });
          setTimeout(() => {
            this.setState({ alert: false, message: "", alertColor: "" });
          }, 2000);
        } else {
          this.setState({
            alert: true,
            message: "You evaluated him before",
            alertColor: "danger",
          });
          setTimeout(() => {
            this.setState({ alert: false, message: "", alertColor: "" });
          }, 2000);
        }
      } else {
        this.props.onEvaluateEmployee(
          this.state.selectedOption.id,
          this.props.record,
          this.state.evaluationCategories,
          this.state.criteriasArray,
          this.state.note,
          this.props.userId
        );
        this.setState({
          alert: true,
          message: "Evaluation will be added",
          alertColor: "success",
        });
        setTimeout(() => {
          this.setState({ alert: false, message: "", alertColor: "" });
        }, 2000);
      }
    }
  };

  noteChangedHandler = (event) => {
    this.setState({ note: event.target.value });
  };

  render() {
    return (
      <Card title="Evaluation">
        <div
          className={classes.textEditorCard}
          style={{ marginBottom: "20px" }}
        >
          <h4 style={{ marginLeft: "20px" }}>Team</h4>
          <hr />

          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              width: "30%",
              marginLeft: "20px",
            }}
          >
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoading}
              isClearable={this.state.isClearable}
              isRtl={this.state.isRtl}
              isSearchable={this.state.isSearchable}
              name="color"
              options={this.state.memberOptions}
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

          <MDBRow>
            <MDBCol md="3" style={{ marginLeft: "20px" }}>
              {typeof this.props.location.state != "undefined" &&
              this.state.selectedOption == "" ? (
                <div className={classes.textEditorCard} id="location-div">
                  <MDBRow>
                    <MDBCol sm="5">
                      <img
                        src={Image}
                        alt="Avatar"
                        style={{
                          width: "100%",
                          // padding: "30px",
                          marginTop: "20px",
                          marginLeft: "10px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol
                      sm="7"
                      style={{ textAlign: "left", marginTop: "60px" }}
                    >
                      <h5>
                        <b>
                          {
                            this.props.location.state.detail.member
                              .teamMemberName
                          }
                        </b>
                      </h5>
                      <p>
                        {
                          this.props.location.state.detail.member
                            .teamMemberEmail
                        }
                      </p>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <div
                    className={classes.container}
                    style={{ textAlign: "left" }}
                  >
                    {this.props.location.state.detail.skills.map((empSkill) => (
                      <Chip
                        key={empSkill.id}
                        className={classes.Chips}
                        label={empSkill.skill}
                      />
                    ))}
                  </div>
                </div>
              ) : this.state.selectedOption == null ||
                this.state.selectedOption == "" ? null : (
                <div className={classes.textEditorCard} id="option-div">
                  <MDBRow>
                    <MDBCol sm="5">
                      <img
                        src={Image}
                        alt="Avatar"
                        style={{
                          width: "100%",
                          // padding: "30px",
                          marginTop: "20px",
                          marginLeft: "10px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol
                      sm="7"
                      style={{ textAlign: "left", marginTop: "60px" }}
                    >
                      <h5>
                        <b>{this.state.selectedOption.value}</b>
                      </h5>
                      <p>{this.state.selectedOption.email}</p>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <div
                    className={classes.container}
                    style={{ textAlign: "left" }}
                  >
                    {this.state.selectedOption.skills != null
                      ? this.state.selectedOption.skills.map((empSkill) => (
                          <Chip
                            key={empSkill.id}
                            className={classes.Chips}
                            label={empSkill.skill}
                          />
                        ))
                      : null}
                  </div>
                </div>
              )}
            </MDBCol>
            <MDBCol md="5" style={{ marginLeft: "20px" }}>
              <div className={classes.wrapper}>
                {this.state.evaluationCategories.map((data) => (
                  <RadarChartEvaluationPage
                    key={data.id}
                    idNo={data.id}
                    num={data.id}
                    category={data.category}
                    data={this.state.criteriasArray}
                  />
                ))}
              </div>
            </MDBCol>
          </MDBRow>
        </div>

        <div
          className={classes.textEditorCard}
          style={{ marginBottom: "20px" }}
        >
          <h4 style={{ marginLeft: "20px" }}>Criterias</h4>
          <hr />

          {this.state.evaluationCategories.map((data) => (
            <div
              key={data.id}
              className={classes.textEditorCard}
              style={{ marginBottom: "20px" }}
            >
              <h4 style={{ marginLeft: "20px" }}>{data.category}</h4>
              <hr />

              <div className={classes.wrapperSlider}>
                {this.state.criteriasArray.map((el) =>
                  el.category == data.category ? (
                    <div
                      key={el.id}
                      className={classes.sliderCard}
                      style={{ marginBottom: "20px" }}
                    >
                      <label style={{ marginLeft: "20px", marginTop: "20px" }}>
                        {el.criteria}
                      </label>
                      <div style={{ marginLeft: "20px" }}>
                        <PrettoSlider
                          valueLabelDisplay="auto"
                          aria-label="pretto slider"
                          defaultValue={0}
                          onChange={(event, value) =>
                            this.sliderChangedHandler(event, value, el)
                          }
                        />
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={classes.textEditorCard}
          style={{ marginBottom: "20px" }}
        >
          <h4 style={{ marginLeft: "20px" }}>Extra notes</h4>
          <hr />

          <div style={{ marginBottom: "20px" }}>
            {/* <Editor
                // initialValue="<p>This is the initial content of the editor</p>"
                init={{
                  height: 600,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
                }}
                onEditorChange={this.handleEditorChange}
              /> */}
            <textarea
              className={classes.Input}
              style={{ lineHeight: "10em", width: "100%" }}
              onChange={this.noteChangedHandler}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <MDBBtn
              color="primary"
              onClick={this.evaluateEmployeeHandler}
              style={{ marginBottom: "20px" }}
            >
              ADD
            </MDBBtn>
            {this.state.alert ? (
              <div style={{ width: "100%", marginTop: "20px" }}>
                <MDBAlert
                  color={this.state.alertColor}
                  dismiss
                  style={{ height: "5%" }}
                >
                  {this.state.message}
                </MDBAlert>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    team: state.team,
    email: state.email,
    teamMember1Skills: state.teamMember1Skills,
    employees: state.employees,
    evaluationCategories: state.evaluationCategories,
    criteriasArray: state.criteriasArray,
    userId: state.employeeId,
    evaluatedList: state.evaluatedList,
    record: state.record,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUser: (email) => dispatch(fetchUser(email)),
    onFetchEmployees: () => dispatch(fetchEmployees()),
    onFetchCriteriasForEvaluation: () =>
      dispatch(fetchCriteriasForEvaluation()),
    onFetchEvaluatedList: (employeeId) =>
      dispatch(fetchEvaluatedList(employeeId)),
    onFetchEmployeeEvaluationRecord: (employeeId) =>
      dispatch(fetchEmployeeEvaluationRecord(employeeId)),
    onEvaluateEmployee: (
      employeeId,
      employeeRecord,
      evaluationCategory,
      criteriasArray,
      note,
      userId
    ) =>
      dispatch(
        evaluateEmployee(
          employeeId,
          employeeRecord,
          evaluationCategory,
          criteriasArray,
          note,
          userId
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
