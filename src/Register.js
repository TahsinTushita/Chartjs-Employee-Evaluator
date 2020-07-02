import React, { Component } from "react";
import { MDBBtn } from "mdbreact";
import Card from "./App/components/MainCard";
import { Form } from "react-bootstrap";
import classes from "./CommonAssets/CommonCss/SimpleInput.module.css";
import { connect } from "react-redux";
import { addEmployee } from "./store/actionCreators";
import Spinner from "./Components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
const INITIAL_STATE = {};

class Register extends Component {
  state = {
    admin: false,
    registrationForm: {
      employeeName: {
        elementConfig: {
          name: "employeeName",
          type: "text",
          placeholder: "employee name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      email: {
        elementConfig: {
          name: "email",
          type: "email",
          placeholder: "email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
      },
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
      },
    },
    formIsValid: false,
  };

  INITIAL_STATE = { ...this.state };

  checkValidity = (value, rules) => {
    let password = "password";
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isPassword) {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.equalsPassword) {
      isValid =
        value === this.state.registrationForm[password].value && isValid;
    }

    return isValid;
  };

  adminCheckedHandler = (event) => {
    this.setState({ admin: event.target.checked });
  };

  inputChangedHandler = (event, InputIdentifier) => {
    let updatedRegistrationForm = { ...this.state.registrationForm };
    let updatedFormElement = { ...updatedRegistrationForm[InputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    if (updatedFormElement.valid === false) {
      event.target.className = classes.Invalid;
    } else {
      event.target.className = classes.Input;
    }
    updatedRegistrationForm[InputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let InputIdentifier in updatedRegistrationForm) {
      formIsValid =
        updatedRegistrationForm[InputIdentifier].valid && formIsValid;
    }

    this.setState({
      registrationForm: updatedRegistrationForm,
      formIsValid: formIsValid,
    });
  };

  registrationHandler = (event) => {
    event.preventDefault();

    let formData = {};
    for (let InputIdentifier in this.state.registrationForm) {
      formData[InputIdentifier] = this.state.registrationForm[
        InputIdentifier
      ].value;
    }

    let email = "email";
    let password = "password";
    let employeeName = "employeeName";

    let employee = {
      email: formData[email],
      password: formData[password],
      returnSecureToken: true,
    };

    let dbEmployee = {
      employeeName: formData[employeeName],
      admin: this.state.admin,
      email: formData[email],
    };

    this.setState(INITIAL_STATE);
    this.props.onAddEmployee(employee, dbEmployee);
  };

  render() {
    let formElementsArray = [];

    for (let key in this.state.registrationForm) {
      formElementsArray.push({
        id: key,
        config: this.state.registrationForm[key],
      });
    }

    let form = formElementsArray.map((formElement) => {
      return formElement.id === "employeeName" ? (
        <div style={{ display: "flex" }} key={formElement.id}>
          <input
            required
            onChange={(event) =>
              this.inputChangedHandler(event, formElement.id)
            }
            className={classes.Input}
            {...formElement.config.elementConfig}
            value={formElement.config.value}
          />
          <Form.Group>
            <Form.Check
              custom
              type="checkbox"
              id="admin"
              label="Admin"
              style={{ marginTop: "20px", marginLeft: "80px" }}
              onChange={this.adminCheckedHandler}
            />
          </Form.Group>
        </div>
      ) : (
        <input
          key={formElement.id}
          required
          onChange={(event) => this.inputChangedHandler(event, formElement.id)}
          className={classes.Input}
          {...formElement.config.elementConfig}
          value={formElement.config.value}
        />
      );
    });

    if (this.props.loading) {
      form = <Spinner />;
    }

    let redirectTo = null;
    if (this.props.signedUp) {
      redirectTo = <Redirect to="/employees" />;
    }

    return (
      <Card title="Register">
        <div className={classes.card}>
          <div style={{ display: "flex" }}>
            <h4 style={{ marginLeft: "20px", marginTop: "20px" }}>Required</h4>
            <h4 style={{ marginLeft: "750px", marginTop: "20px" }}>Optional</h4>
          </div>
          <hr />
          <form style={{ marginLeft: "20px" }}>
            {redirectTo}
            {form}
            <MDBBtn
              color="primary"
              onClick={this.registrationHandler}
              disabled={!this.state.formIsValid}
              style={{ marginBottom: "20px" }}
            >
              ADD
            </MDBBtn>
          </form>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    signedUp: state.signedUp,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddEmployee: (employee, dbEmployee) =>
      dispatch(addEmployee(employee, dbEmployee)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
