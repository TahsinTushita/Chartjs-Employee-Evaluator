import React from "react";
import { NavLink, Redirect } from "react-router-dom";
import Spinner from "../../../Components/UI/Spinner/Spinner";
import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import { connect } from "react-redux";
import { auth } from "../../../store/actionCreators";
import classes from "../../../CommonAssets/CommonCss/SimpleInput.module.css";
import Axios from "axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class SignIn extends React.Component {
  state = {
    formIsValid: false,
    signInForm: {
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
    },
  };

  checkValidity = (value, rules) => {
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

    return isValid;
  };

  inputChangedHandler = (event, InputIdentifier) => {
    let updatedSignInForm = { ...this.state.signInForm };
    let updatedFormElement = { ...updatedSignInForm[InputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    if (updatedFormElement.valid === false) {
      event.target.className = classes.SignInInvalid;
    } else {
      event.target.className = classes.SignInInput;
    }
    console.log(updatedFormElement.valid);
    updatedSignInForm[InputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let InputIdentifier in updatedSignInForm) {
      formIsValid = updatedSignInForm[InputIdentifier].valid && formIsValid;
    }

    this.setState({
      signInForm: updatedSignInForm,
      formIsValid: formIsValid,
    });
  };

  authHandler = (event) => {
    event.preventDefault();

    let formData = {};
    for (let InputIdentifier in this.state.signInForm) {
      formData[InputIdentifier] = this.state.signInForm[InputIdentifier].value;
    }

    let email = "email";
    let password = "password";

    let employee = {
      email: formData[email],
      password: formData[password],
      returnSecureToken: true,
    };

    this.props.onAuth(employee);
  };

  render() {
    let formElementsArray = [];

    for (let key in this.state.signInForm) {
      formElementsArray.push({
        id: key,
        config: this.state.signInForm[key],
      });
    }

    let form = formElementsArray.map((formElement) => {
      return (
        <div className="input-group mb-3" key={formElement.id}>
          <input
            required
            onChange={(event) =>
              this.inputChangedHandler(event, formElement.id)
            }
            {...formElement.config.elementConfig}
            value={formElement.config.value}
            className={classes.SignInInput}
          />
        </div>
      );
    });

    if (this.props.loading) {
      form = <Spinner />;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/team" />;
    }

    return (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="feather icon-unlock auth-icon" />
                </div>
                <h3 className="mb-4">Login</h3>
                {authRedirect}
                {form}
                {/* {formElementsArray.map((formElement) => {
                  return (
                    <div className="input-group mb-3" key={formElement.id}>
                      <input
                        required
                        onChange={(event) =>
                          this.inputChangedHandler(event, formElement.id)
                        }
                        {...formElement.config.elementConfig}
                        value={formElement.config.value}
                        className={classes.SignInInput}
                      />
                    </div>
                  );
                })} */}

                {/* <div className="form-group text-left">
                  <div className="checkbox checkbox-fill d-inline">
                    <input
                      type="checkbox"
                      name="checkbox-fill-1"
                      id="checkbox-fill-a1"
                    />
                    <label htmlFor="checkbox-fill-a1" className="cr">
                      {" "}
                      Save credentials
                    </label>
                  </div>
                </div> */}
                <button
                  className="btn btn-primary shadow-2 mb-4"
                  disabled={!this.state.formIsValid}
                  onClick={this.authHandler}
                >
                  Login
                </button>
                <p className="mb-2 text-muted">
                  Forgot password?{" "}
                  <NavLink to="/auth/reset-password-1">Reset</NavLink>
                </p>
                {/* <p className="mb-0 text-muted">
                  Don’t have an account?{" "}
                  <NavLink to="/auth/signup-1">Signup</NavLink>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token != null,
    loading: state.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (employee) => dispatch(auth(employee)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(SignIn, Axios));
