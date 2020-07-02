import * as actionTypes from "./actionTypes";
import Axios from "axios";

const checkAuthTimeout = (expiretionTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(signout());
    }, expiretionTime * 1000);
  };
};

export const auth = (employee) => {
  return (dispatch) => {
    dispatch(loadingStart());

    Axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API-KEY]",
      employee
    )
      .then((response) => {
        let expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("email", employee.email);
        localStorage.setItem("id", employee.id);
        dispatch(authSuccess(response.data.idToken));
        dispatch(fetchUser(employee.email));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const authSuccess = (idToken, email) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    email: email,
  };
};

export const authenticated = (idToken, email, admin) => {
  return {
    type: actionTypes.AUTHENTICATED,
    idToken: idToken,
    email: email,
    admin: admin,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    let value = "true";
    let admin = value === localStorage.getItem("admin");
    if (!token) {
      dispatch(signout());
    } else {
      let expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(signout());
      } else {
        dispatch(authenticated(token, email, admin));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const signout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("admin");
  localStorage.removeItem("email");
  localStorage.removeItem("id");
  return {
    type: actionTypes.SIGNOUT,
  };
};

export const fetchUser = (email) => {
  return (dispatch) => {
    Axios.get(`/employees.json?orderBy=\"email\"&equalTo=\"${email}\"`)
      .then((response) => {
        let userProfile = [];

        for (let key in response.data) {
          userProfile.push({
            ...response.data[key],
            id: key,
          });
        }
        localStorage.setItem("admin", userProfile[0].admin);
        localStorage.setItem("id", userProfile[0].id);
        dispatch(
          fetchUserSuccess(
            userProfile[0].admin,
            userProfile[0].employeeName,
            userProfile[0].id
          )
        );
        dispatch(fetchEmployeeTeam(userProfile[0].id));
        dispatch(fetchEmployeeSkills(userProfile[0].id));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const fetchUserSuccess = (admin, employeeName, employeeId) => {
  return {
    type: actionTypes.FETCH_USER_SUCCESS,
    admin: admin,
    employeeName: employeeName,
    employeeId: employeeId,
  };
};

export const addEmployeeToTeam = (employeeId, data) => {
  return (dispatch) => {
    Axios.post(`/employees/${employeeId}/Team.json`, data)
      .then((response) => {
        dispatch(fetchEmployeeTeam(employeeId));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const removeEmployeeFromTeam = (employeeId, teamMemberId) => {
  let memberId = teamMemberId + ".json";
  return (dispatch) => {
    Axios.delete(`/employees/${employeeId}/Team/${memberId}`)
      .then((response) => {
        dispatch(fetchEmployeeTeam(employeeId));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const addEmployee = (employee, dbEmployee) => {
  return (dispatch) => {
    dispatch(loadingStart());

    Axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API-KEY]",
      employee
    )
      .then((response) => {
        dispatch(addEmployeeToDatabase(dbEmployee));
        dispatch(signedUp());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const signedUp = () => {
  return {
    type: actionTypes.SIGNED_UP,
  };
};

export const addEmployeeToDatabase = (dbEmployee) => {
  return (dispatch) => {
    Axios.post("/employees.json", dbEmployee)
      .then((response) => dispatch(fetchEmployees()))
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const fetchEmployees = () => {
  return (dispatch) => {
    Axios.get("/employees.json")
      .then((response) => {
        let fetchedEmployees = [];
        for (let key in response.data) {
          fetchedEmployees.push({ ...response.data[key], id: key });
        }

        dispatch(fetchEmployeesSuccess(fetchedEmployees));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const fetchEmployeesSuccess = (fetchedEmployees) => {
  return {
    type: actionTypes.FETCH_EMPLOYEES_SUCCESS,
    employees: fetchedEmployees,
  };
};

export const fetchEmployeesWithCriterias = () => {
  return (dispatch) => {
    Axios.get(`/employees.json`)
      .then((response) => {
        let fetchedEmployees = [];
        for (let key in response.data) {
          fetchedEmployees.push({ ...response.data[key], id: key });
        }

        let evaluationCriterias = [];
        fetchedEmployees.map((emp) => {
          let array = [];
          let criteriasArray = [];
          for (let key in emp.evaluationCriterias) {
            array.push(...emp.evaluationCriterias[key]);
          }
          array.map((el) => {
            for (let key in el.criterias) {
              criteriasArray.push({
                id: key,
                category: el.category,
                criteria: el.criterias[key].criteria,
                value: el.criterias[key].value,
                empId: emp.id,
              });
            }
          });
          evaluationCriterias.push({ id: emp.id, criterias: criteriasArray });
        });
        dispatch(
          fetchEmployeesWithCriteriasSuccess(
            fetchedEmployees,
            evaluationCriterias
          )
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEmployeesWithCriteriasSuccess = (
  employees,
  employeeCriteriasArray
) => {
  return {
    type: actionTypes.FETCH_EMPLOYEES_WITH_CRITERIAS_SUCCESS,
    employees: employees,
    employeeCriteriasArray: employeeCriteriasArray,
  };
};

export const changePassword = (employee) => {
  return (dispatch) => {
    dispatch(setSpinnerLoader(1));
    Axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API-KEY]",
      employee
    )
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        let expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(changePasswordSuccess(response.data.idToken));
        dispatch(setSpinnerLoader(2));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const changePasswordSuccess = (idToken) => {
  return {
    type: actionTypes.CHANGE_PASSWORD_SUCCESS,
    idToken: idToken,
  };
};

export const fetchEmployeeTeam = (employeeId) => {
  return (dispatch) => {
    Axios.get(`/employees/${employeeId}/Team.json`)
      .then((response) => {
        let team = [];
        for (let key in response.data) {
          team.push({ ...response.data[key], id: key });
        }

        dispatch(fetchEmployeeTeamSuccess(team));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
        console.log(error);
      });
  };
};

export const fetchEmployeeTeamSuccess = (team) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_TEAM_SUCCESS,
    team: team,
  };
};

export const addEmployeeSkill = (employeeId, skill) => {
  return (dispatch) => {
    Axios.post(`employees/${employeeId}/skills.json`, skill)
      .then((response) => {
        dispatch(fetchEmployeeSkills(employeeId));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEmployeeSkills = (employeeId) => {
  return (dispatch) => {
    Axios.get(`employees/${employeeId}/skills.json`)
      .then((response) => {
        let skills = [];
        for (let key in response.data) {
          skills.push({ ...response.data[key], id: key });
        }
        dispatch(fetchEmployeeSkillsSuccess(skills));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEmployeeSkillsSuccess = (skills) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_SKILLS_SUCCESS,
    employeeSkills: skills,
  };
};

export const removeSkillFromEmployee = (employeeId, id) => {
  let skillId = id + ".json";

  return (dispatch) => {
    Axios.delete(`employees/${employeeId}/skills/${skillId}`)
      .then((response) => {
        dispatch(fetchEmployeeSkills(employeeId));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const addSkillCategory = (category) => {
  return (dispatch) => {
    Axios.post("/skills.json", category)
      .then((response) => {
        dispatch(fetchSkills());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const addSkill = (categoryId, skill) => {
  return (dispatch) => {
    Axios.post(`/skills/${categoryId}/skills.json`, skill)
      .then((response) => {
        dispatch(fetchSkills());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchSkills = () => {
  return (dispatch) => {
    Axios.get("/skills.json")
      .then((response) => {
        let fetchedSkills = [];
        for (let key in response.data) {
          fetchedSkills.push({ ...response.data[key], id: key });
        }

        dispatch(fetchSkillsSuccess(fetchedSkills));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchSkillsSuccess = (skills) => {
  return {
    type: actionTypes.FETCH_SKILLS_SUCCESS,
    skills: skills,
  };
};

export const removeSkillCategory = (id) => {
  let categoryId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/skills/${categoryId}`)
      .then((response) => {
        dispatch(fetchSkills());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const removeSkillFromCategory = (categoryId, id) => {
  let skillId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/skills/${categoryId}/skills/${skillId}`)
      .then((response) => {
        dispatch(fetchSkills());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler());
      });
  };
};

export const addEvaluationCriteriaCategory = (category) => {
  return (dispatch) => {
    Axios.post("/evaluationCriterias.json", category)
      .then((response) => {
        dispatch(fetchEvaluationCriterias());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const addEvaluationCriteria = (categoryId, criteria) => {
  return (dispatch) => {
    Axios.post(`/evaluationCriterias/${categoryId}/criterias.json`, criteria)
      .then((response) => {
        dispatch(fetchEvaluationCriterias());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEvaluationCriterias = () => {
  return (dispatch) => {
    Axios.get("/evaluationCriterias.json")
      .then((response) => {
        let fetchedCriterias = [];
        for (let key in response.data) {
          fetchedCriterias.push({ ...response.data[key], id: key });
        }

        dispatch(fetchEvaluationCriteriasSuccess(fetchedCriterias));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEvaluationCriteriasSuccess = (criterias) => {
  return {
    type: actionTypes.FETCH_EVALUATION_CRITERIAS_SUCCESS,
    criterias: criterias,
  };
};

export const fetchCriteriasForEvaluation = () => {
  return (dispatch) => {
    Axios.get("/evaluationCriterias.json")
      .then((response) => {
        let fetchedCriterias = [];
        for (let key in response.data) {
          fetchedCriterias.push({ ...response.data[key], id: key });
        }

        let array = Object.keys(fetchedCriterias).map(
          (key) => fetchedCriterias[key]
        );

        let criteriasArray = [];
        let evaluationCategories = [];
        array.map((data) => {
          evaluationCategories.push({ id: data.id, category: data.category });
          for (let key in data.criterias) {
            criteriasArray.push({
              id: key,
              category: data.category,
              criteria: data.criterias[key].criteria,
              value: 0,
            });
          }
        });
        dispatch(
          fetchCriteriasForEvaluationSuccess(
            evaluationCategories,
            criteriasArray
          )
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchCriteriasForEvaluationSuccess = (
  evaluationCategories,
  criteriasArray
) => {
  return {
    type: actionTypes.FETCH_CRITERIAS_FOR_EVALUATION_SUCCESS,
    evaluationCategories: evaluationCategories,
    criteriasArray: criteriasArray,
  };
};

export const removeEvaluationCriteriaCategory = (id) => {
  let categoryId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/evaluationCriterias/${categoryId}`)
      .then((response) => {
        dispatch(fetchEvaluationCriterias());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const removeEvaluationCriteriaFromCategory = (categoryId, id) => {
  let criteriaId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/evaluationCriterias/${categoryId}/criterias/${criteriaId}`)
      .then((response) => {
        dispatch(fetchEvaluationCriterias());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler());
      });
  };
};

export const addTagCategory = (category) => {
  return (dispatch) => {
    Axios.post("/tags.json", category)
      .then((response) => {
        dispatch(fetchTags());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const addTag = (categoryId, tag) => {
  return (dispatch) => {
    Axios.post(`/tags/${categoryId}/tags.json`, tag)
      .then((response) => {
        dispatch(fetchTags());
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchTags = () => {
  return (dispatch) => {
    Axios.get("/tags.json")
      .then((response) => {
        let fetchedTags = [];
        for (let key in response.data) {
          fetchedTags.push({ ...response.data[key], id: key });
        }

        dispatch(fetchTagsSuccess(fetchedTags));
      })
      .catch((error) => {
        dispatch(errorHandler(error));
      });
  };
};

export const fetchTagsSuccess = (tags) => {
  return {
    type: actionTypes.FETCH_TAGS_SUCCESS,
    tags: tags,
  };
};

export const removeTagCategory = (id) => {
  let categoryId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/tags/${categoryId}`)
      .then((response) => {
        dispatch(fetchTags());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const removeTagFromCategory = (categoryId, id) => {
  let tagId = id + ".json";
  return (dispatch) => {
    Axios.delete(`/tags/${categoryId}/tags/${tagId}`)
      .then((response) => {
        dispatch(fetchTags());
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler());
      });
  };
};

export const evaluateEmployee = (
  employeeId,
  employeeRecord,
  evaluationCategories,
  criteriasArray,
  note,
  userId
) => {
  let categoryData = [];
  if (employeeRecord == null) {
    evaluationCategories.map((data) => {
      let array = [];
      criteriasArray.map((el) => {
        if (data.category == el.category) {
          array.push({
            criteria: el.criteria,
            value: el.value,
            totalPoints: el.value,
            numOfTimesEvaluated: 1,
          });
        }
      });
      categoryData.push({ category: data.category, criterias: array });
    });

    return (dispatch) => {
      Axios.post(
        `/employees/${employeeId}/evaluationCriterias.json`,
        categoryData
      )
        .then((response) => {
          dispatch(addToEvaluatedList(employeeId, userId));

          if (note != "") {
            if (note != null) {
              dispatch(addNoteHandler(employeeId, note));
            }
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(errorHandler(error));
        });
    };
  } else {
    evaluationCategories.map((data) => {
      let array = [];
      employeeRecord.map((rec) => {
        if (data.category == rec.category) {
          criteriasArray.map((el) => {
            if (rec.category == el.category) {
              if (rec.criteria == el.criteria) {
                rec.totalPoints = rec.totalPoints + el.value;
                rec.numOfTimesEvaluated = rec.numOfTimesEvaluated + 1;
                if (rec.totalPoints > 0) {
                  rec.value = rec.totalPoints / rec.numOfTimesEvaluated;
                }
                array.push({
                  criteria: el.criteria,
                  value: rec.value,
                  totalPoints: rec.totalPoints,
                  numOfTimesEvaluated: rec.numOfTimesEvaluated,
                });
              }
            }
          });
        }
      });
      categoryData.push({ category: data.category, criterias: array });
    });

    return (dispatch) => {
      dispatch(removeEmployeeRecord(employeeId, categoryData, userId, note));
    };
  }
};

export const addToEvaluatedList = (employeeId, userId) => {
  let data = {
    evaluatedEmployeeId: employeeId,
  };
  return (dispatch) => {
    Axios.post(`/employees/${userId}/evaluatedList.json`, data)
      .then((response) => {
        dispatch(fetchEvaluatedList(userId));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEmployeeEvaluationRecord = (employeeId) => {
  return (dispatch) => {
    Axios.get(`/employees/${employeeId}/evaluationCriterias.json`)
      .then((response) => {
        if (response.data != null) {
          let array = [];
          for (let key in response.data) {
            array.push({ id: key, record: response.data[key] });
          }

          let recordArray = [];
          array[0].record.map((arr) => {
            for (let key in arr.criterias) {
              recordArray.push({
                id: key,
                category: arr.category,
                criteria: arr.criterias[key].criteria,
                value: arr.criterias[key].value,
                totalPoints: arr.criterias[key].totalPoints,
                numOfTimesEvaluated: arr.criterias[key].numOfTimesEvaluated,
              });
            }
          });

          dispatch(fetchEmployeeEvaluationRecordSuccess(recordArray));
        } else {
          dispatch(fetchEmployeeEvaluationRecordSuccess(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEmployeeEvaluationRecordSuccess = (record) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_EVALUATION_RECORD_SUCCESS,
    record: record,
  };
};

export const fetchEvaluatedList = (employeeId) => {
  return (dispatch) => {
    Axios.get(`/employees/${employeeId}/evaluatedList.json`)
      .then((response) => {
        let evaluatedList = [];
        for (let key in response.data) {
          evaluatedList.push({
            id: key,
            evaluatedEmployeeId: response.data[key].evaluatedEmployeeId,
          });
        }

        dispatch(fetchEvaluatedListSuccess(evaluatedList));
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const fetchEvaluatedListSuccess = (evaluatedList) => {
  return {
    type: actionTypes.FETCH_EVALUATED_LIST_SUCCESS,
    evaluatedList: evaluatedList,
  };
};

export const removeEmployeeRecord = (
  employeeId,
  categoryData,
  userId,
  note
) => {
  return (dispatch) => {
    Axios.delete(`/employees/${employeeId}/evaluationCriterias.json`)
      .then((response) => {
        Axios.post(
          `/employees/${employeeId}/evaluationCriterias.json`,
          categoryData
        )
          .then((response) => {
            dispatch(addToEvaluatedList(employeeId, userId));

            if (note != "") {
              if (note != null) {
                dispatch(addNoteHandler(employeeId, note));
              }
            }
          })
          .catch((error) => {
            console.log(error);
            dispatch(errorHandler(error));
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const addNoteHandler = (employeeId, note) => {
  let data = {
    note: note,
  };

  return (dispatch) => {
    Axios.post(`/employees/${employeeId}/notes.json`, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        dispatch(errorHandler(error));
      });
  };
};

export const setSpinnerLoader = (num) => {
  return {
    type: actionTypes.SET_SPINNER_LOADER,
    num: num,
  };
};

export const loadingStart = () => {
  return {
    type: actionTypes.LOADING_START,
  };
};

export const errorHandler = (error) => {
  return {
    type: actionTypes.ERROR_HANDLER,
    error: error,
  };
};
