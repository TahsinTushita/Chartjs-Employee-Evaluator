import React, { Component } from "react";
import Card from "./App/components/MainCard";
import { MDBBtn, MDBCol, MDBRow, MDBAlert } from "mdbreact";
import Chip from "@material-ui/core/Chip";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import Spinner from "./Components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import {
  fetchUser,
  changePassword,
  setSpinnerLoader,
} from "./store/actionCreators";

class Profile extends Component {
  state = {
    employeeName: "",
    alert: false,
    changeProfileForm: {
      password: {
        elementConfig: {
          name: "password",
          type: "password",
          placeholder: "password",
        },
        value: "",
        validation: {
          required: true,
          isPassword: true,
        },
        valid: false,
        touched: false,
      },
      passwordConfirmation: {
        elementConfig: {
          name: "passwordConfirmation",
          type: "password",
          placeholder: "password confirmation",
        },
        value: "",
        validation: {
          required: true,
          isPassword: true,
          equalsPassword: true,
        },
        valid: false,
        touched: false,
      },
    },
    formIsValid: false,
  };

  componentDidMount() {
    this.props.onFetchUser(this.props.email);
  }

  checkValidity = (value, rules) => {
    let password = "password";
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.isPassword) {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.equalsPassword) {
      isValid =
        value === this.state.changeProfileForm[password].value && isValid;
    }

    return isValid;
  };

  inputChangedHandler = (event, InputIdentifier) => {
    let updatedChangeProfileForm = { ...this.state.changeProfileForm };
    let updatedFormElement = { ...updatedChangeProfileForm[InputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    if (updatedFormElement.valid === false) {
      event.target.className = classes.Invalid;
    } else {
      event.target.className = classes.Input;
    }
    updatedChangeProfileForm[InputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let InputIdentifier in updatedChangeProfileForm) {
      formIsValid =
        updatedChangeProfileForm[InputIdentifier].valid && formIsValid;
    }

    this.setState({
      changeProfileForm: updatedChangeProfileForm,
      formIsValid: formIsValid,
    });
  };

  nameChangedHandler = (event) => {
    this.setState({ employeeName: event.target.value });
  };

  changePasswordHandler = (event) => {
    event.preventDefault();

    let formData = {};
    for (let InputIdentifier in this.state.changeProfileForm) {
      formData[InputIdentifier] = this.state.changeProfileForm[
        InputIdentifier
      ].value;
    }
    let password = "password";

    let employee = {
      idToken: this.props.token,
      password: formData[password],
      returnSecureToken: true,
    };
    this.props.onChangePassword(employee);
    this.setState({ alert: true });
    setTimeout(() => {
      this.setState({ alert: false });
    }, 2000);
  };

  checkSpinnerLoaderState = () => {
    if (this.props.spinnerLoader == 2) {
      this.setState({ alert: true });
      setTimeout(() => {
        this.setState({ alert: false });
        this.props.onSetSpinnerLoader(3);
      }, 2000);
    }
  };

  render() {
    let formElementsArray = [];

    for (let key in this.state.changeProfileForm) {
      formElementsArray.push({
        id: key,
        config: this.state.changeProfileForm[key],
      });
    }

    // if (this.props.spinnerLoader == 1) {
    //   form = <Spinner />;
    // }

    return (
      <Card title="Profile">
        <MDBRow>
          <MDBCol
            md="4"
            className={classes.card}
            style={{ marginLeft: "20px" }}
          >
            <form style={{ marginTop: "60px" }}>
              <h3>{this.props.employeeName}</h3>
              {formElementsArray.map((formElement) => {
                return (
                  <input
                    key={formElement.id}
                    required
                    type="text"
                    {...formElement.config.elementConfig}
                    value={formElement.config.value}
                    style={{ width: "98%" }}
                    className={classes.Input}
                    onChange={(event) =>
                      this.inputChangedHandler(event, formElement.id)
                    }
                  />
                );
              })}
              <MDBBtn
                color="primary"
                style={{ marginBottom: "20px" }}
                onClick={this.changePasswordHandler}
              >
                CHANGE PASSWORD
              </MDBBtn>
            </form>
            {this.state.alert ? (
              <div style={{ width: "100%", marginTop: "20px" }}>
                <MDBAlert color="success" dismiss style={{ height: "5%" }}>
                  Password will be changed!
                </MDBAlert>
              </div>
            ) : null}
          </MDBCol>
          <MDBCol
            md="5"
            style={{ textAlign: "left", marginLeft: "20px" }}
            className={classes.card}
          >
            <h4 style={{ marginTop: "20px" }}>Skillset</h4>
            <hr />

            {this.props.employeeSkills.map((empSkill) => (
              <Chip
                key={empSkill.id}
                className={classes.Chips}
                label={empSkill.skill}
              />
            ))}
          </MDBCol>
        </MDBRow>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employeeName: state.employeeName,
    email: state.email,
    token: state.token,
    employeeSkills: state.employeeSkills,
    // spinnerLoader: state.spinnerLoader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUser: (email) => dispatch(fetchUser(email)),
    onChangePassword: (employee) => dispatch(changePassword(employee)),
    // onSetSpinnerLoader: (num) => dispatch(setSpinnerLoader(num)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
