import * as actions from "./actions";
import config from "./../config";
import * as actionTypes from "./actionTypes";
import { updateObject } from "./utility";

const initialState = {
  isOpen: [], //for active default menu
  isTrigger: [], //for active default menu, set blank for horizontal
  ...config,
  isFullScreen: false, // static can't change
  tags: [],
  employees: [],
  team: [],
  employeeSkills: [],
  skills: [],
  evaluationCriterias: [],
  evaluationCategories: [],
  criteriasArray: [],
  evaluatedList: null,
  record: [],
  employeeCriterias: [],
  profile: {},
  token: null,
  loading: false,
  error: null,
  admin: false,
  email: null,
  employeeName: null,
  employeeId: null,
  signedUp: false,
  spinnerLoader: 3,
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    loading: false,
    error: null,
    email: action.email,
    // profile: action.profile,
    // team: action.team,
  });
};

const authenticated = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    loading: false,
    error: null,
    email: action.email,
    admin: action.admin,
  });
};

const signout = (state, action) => {
  return updateObject(state, {
    token: null,
    admin: false,
    employeeName: null,
    email: null,
    error: null,
    employees: [],
  });
};

const signupStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const signedUp = (state, action) => {
  return updateObject(state, {
    signedUp: true,
    error: null,
    loading: false,
  });
};

const changepasswordSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    error: null,
    loading: false,
  });
};

const fetchUserSuccess = (state, action) => {
  return updateObject(state, {
    admin: action.admin,
    employeeName: action.employeeName,
    employeeId: action.employeeId,
    loading: false,
    error: null,
  });
};

const fetchEmployeeTeamSuccess = (state, action) => {
  return updateObject(state, {
    team: action.team,
    error: null,
  });
};

const fetchEmployeesSuccess = (state, action) => {
  return updateObject(state, {
    employees: action.employees,
    signedUp: false,
    error: null,
  });
};

const fetchEmployeesWithCriteriasSuccess = (state, action) => {
  return updateObject(state, {
    employees: action.employees,
    employeeCriterias: action.employeeCriteriasArray,
    error: null,
  });
};

const fetchEmployeeSkillsSuccess = (state, action) => {
  return updateObject(state, {
    employeeSkills: action.employeeSkills,
    error: null,
  });
};

const fetchSkillsSuccess = (state, action) => {
  return updateObject(state, {
    skills: action.skills,
    error: null,
  });
};

const fetchEvaluationCriteriasSuccess = (state, action) => {
  return updateObject(state, {
    evaluationCriterias: action.criterias,
    error: null,
  });
};

const fetchCriteriasForEvaluationSuccess = (state, action) => {
  return updateObject(state, {
    evaluationCategories: action.evaluationCategories,
    criteriasArray: action.criteriasArray,
    error: null,
  });
};

const fetchEvaluatedListSuccess = (state, action) => {
  return updateObject(state, {
    evaluatedList: action.evaluatedList,
    error: null,
  });
};

const fetchEmployeeEvaluationRecordSuccess = (state, action) => {
  return updateObject(state, {
    record: action.record,
    error: null,
  });
};

const fetchTagsSuccess = (state, action) => {
  return updateObject(state, { tags: action.tags, error: null });
};

const setSpinnerLoader = (state, action) => {
  return updateObject(state, {
    spinnerLoader: action.num,
  });
};

const loadingStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const errorHandler = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  let trigger = [];
  let open = [];

  switch (action.type) {
    case actions.COLLAPSE_MENU:
      return {
        ...state,
        collapseMenu: !state.collapseMenu,
      };
    case actions.COLLAPSE_TOGGLE:
      if (action.menu.type === "sub") {
        open = state.isOpen;
        trigger = state.isTrigger;

        const triggerIndex = trigger.indexOf(action.menu.id);
        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        }

        if (triggerIndex === -1) {
          open = [...open, action.menu.id];
          trigger = [...trigger, action.menu.id];
        }
      } else {
        open = state.isOpen;
        const triggerIndex = state.isTrigger.indexOf(action.menu.id);
        trigger = triggerIndex === -1 ? [action.menu.id] : [];
        open = triggerIndex === -1 ? [action.menu.id] : [];
      }

      return {
        ...state,
        isOpen: open,
        isTrigger: trigger,
      };
    case actions.NAV_CONTENT_LEAVE:
      return {
        ...state,
        isOpen: open,
        isTrigger: trigger,
      };
    case actions.NAV_COLLAPSE_LEAVE:
      if (action.menu.type === "sub") {
        open = state.isOpen;
        trigger = state.isTrigger;

        const triggerIndex = trigger.indexOf(action.menu.id);
        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        }
        return {
          ...state,
          isOpen: open,
          isTrigger: trigger,
        };
      }
      return { ...state };
    case actions.FULL_SCREEN:
      return {
        ...state,
        isFullScreen: !state.isFullScreen,
      };
    case actions.FULL_SCREEN_EXIT:
      return {
        ...state,
        isFullScreen: false,
      };
    case actions.CHANGE_LAYOUT:
      return {
        ...state,
        layout: action.layout,
      };

    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);

    case actionTypes.AUTHENTICATED:
      return authenticated(state, action);

    case actionTypes.SIGNOUT:
      return signout(state, action);

    case actionTypes.SIGNUP_START:
      return signupStart(state, action);

    case actionTypes.SIGNED_UP:
      return signedUp(state, action);

    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return changepasswordSuccess(state, action);

    case actionTypes.FETCH_USER_SUCCESS:
      return fetchUserSuccess(state, action);

    case actionTypes.FETCH_EMPLOYEE_TEAM_SUCCESS:
      return fetchEmployeeTeamSuccess(state, action);

    case actionTypes.FETCH_EMPLOYEES_SUCCESS:
      return fetchEmployeesSuccess(state, action);

    case actionTypes.FETCH_EMPLOYEES_WITH_CRITERIAS_SUCCESS:
      return fetchEmployeesWithCriteriasSuccess(state, action);

    case actionTypes.FETCH_EMPLOYEE_SKILLS_SUCCESS:
      return fetchEmployeeSkillsSuccess(state, action);

    case actionTypes.FETCH_SKILLS_SUCCESS:
      return fetchSkillsSuccess(state, action);

    case actionTypes.FETCH_EVALUATION_CRITERIAS_SUCCESS:
      return fetchEvaluationCriteriasSuccess(state, action);

    case actionTypes.FETCH_CRITERIAS_FOR_EVALUATION_SUCCESS:
      return fetchCriteriasForEvaluationSuccess(state, action);

    case actionTypes.FETCH_EVALUATED_LIST_SUCCESS:
      return fetchEvaluatedListSuccess(state, action);

    case actionTypes.FETCH_EMPLOYEE_EVALUATION_RECORD_SUCCESS:
      return fetchEmployeeEvaluationRecordSuccess(state, action);

    case actionTypes.FETCH_TAGS_SUCCESS:
      return fetchTagsSuccess(state, action);

    case actionTypes.SET_SPINNER_LOADER:
      return setSpinnerLoader(state, action);

    case actionTypes.LOADING_START:
      return loadingStart(state, action);

    case actionTypes.ERROR_HANDLER:
      return errorHandler(state, action);

    default:
      return state;
  }
};

export default reducer;
