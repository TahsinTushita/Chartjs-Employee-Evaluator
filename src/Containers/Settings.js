import React, { Component } from "react";
import classes from "../CommonAssets/CommonCss/SimpleInput.module.css";
import { MDBBtn, MDBRow, MDBCol, MDBAlert, MDBCloseIcon } from "mdbreact";
import { connect } from "react-redux";
import {
  addSkillCategory,
  fetchSkills,
  addSkill,
  removeSkillFromCategory,
  removeSkillCategory,
  fetchEvaluationCriterias,
  addEvaluationCriteriaCategory,
  addEvaluationCriteria,
  removeEvaluationCriteriaCategory,
  removeEvaluationCriteriaFromCategory,
  fetchTags,
  addTagCategory,
  addTag,
  removeTagCategory,
  removeTagFromCategory,
} from "../store/actionCreators";
import Card from "../App/components/MainCard";
import Chip from "@material-ui/core/Chip";
let skillsData = [];
let evaluationCriteriasData = [];
let tagsData = [];

class Settings extends Component {
  state = {
    skillCategory: "",
    skill: "",
    tagCategory: "",
    tag: "",
    evaluationCriteriaCategory: "",
    evaluationCriteria: "",
    disabled: false,
    addSkillCategoryDisabled: true,
    addSkillButtonDisabled: true,
    addEvaluationCriteriaCategoryDisabled: true,
    addEvaluationCriteriaButtonDisabled: true,
    addTagCategoryDisabled: true,
    addTagButtonDisabled: true,
    alert: false,
    skillCategoryAlert: false,
    skillAlert: false,
    evaluationCriteriaCategoryAlert: false,
    tagCategoryAlert: false,
  };

  componentDidMount() {
    this.props.onFetchSkills();
    this.props.onFetchEvaluationCriterias();
    this.props.onFetchTags();
  }

  skillCategoryChangedHandler = (event) => {
    let skillCategory = { ...this.state.skillCategory };
    skillCategory = event.target.value;

    event.target.value === ""
      ? this.setState({ addSkillCategoryDisabled: true })
      : this.setState({ addSkillCategoryDisabled: false });

    this.setState({ skillCategory: skillCategory });
  };

  evaluationCriteriaCategoryChangedHandler = (event) => {
    let evaluationCriteriaCategory = {
      ...this.state.evaluationCriteriaCategory,
    };
    evaluationCriteriaCategory = event.target.value;

    event.target.value === ""
      ? this.setState({ addEvaluationCriteriaCategoryDisabled: true })
      : this.setState({ addEvaluationCriteriaCategoryDisabled: false });

    this.setState({ evaluationCriteriaCategory: evaluationCriteriaCategory });
  };

  tagCategoryChangedHandler = (event) => {
    let tagCategory = { ...this.state.tagCategory };
    tagCategory = event.target.value;

    event.target.value === ""
      ? this.setState({ addTagCategoryDisabled: true })
      : this.setState({ addTagCategoryDisabled: false });

    this.setState({ tagCategory: tagCategory });
  };

  skillChangedHandler = (event) => {
    let skill = { ...this.state.skill };
    skill = event.target.value;

    event.target.value === ""
      ? this.setState({ addSkillButtonDisabled: true })
      : this.setState({ addSkillButtonDisabled: false });

    this.setState({ skill: skill });
  };

  evaluationCriteriaChangedHandler = (event) => {
    let evaluationCriteria = { ...this.state.evaluationCriteria };
    evaluationCriteria = event.target.value;

    event.target.value === ""
      ? this.setState({ addEvaluationCriteriaButtonDisabled: true })
      : this.setState({ addEvaluationCriteriaButtonDisabled: false });

    this.setState({ evaluationCriteria: evaluationCriteria });
  };

  tagChangedHandler = (event) => {
    let tag = { ...this.state.tag };
    tag = event.target.value;

    event.target.value === ""
      ? this.setState({ addTagButtonDisabled: true })
      : this.setState({ addTagButtonDisabled: false });

    this.setState({ tag: tag });
  };

  addSkillCategoryButtonHandler = (event) => {
    event.preventDefault();
    let count = 0;

    this.props.skills.map((skill) => {
      if (
        skill.category.toLowerCase() === this.state.skillCategory.toLowerCase()
      )
        count++;
    });

    if (count === 0) {
      this.setState({ skillCategoryAlert: false });
      let category = {
        category: this.state.skillCategory,
      };
      this.props.onAddSkillCategory(category);
    } else {
      this.setState({ skillCategoryAlert: true });
    }
  };

  addEvaluationCriteriaCategoryButtonHandler = (event) => {
    event.preventDefault();
    let count = 0;

    this.props.evaluationCriterias.map((criteria) => {
      if (
        criteria.category.toLowerCase() ===
        this.state.evaluationCriteriaCategory.toLowerCase()
      )
        count++;
    });

    if (count === 0) {
      this.setState({ evaluationCriteriaCategoryAlert: false });
      let category = {
        category: this.state.evaluationCriteriaCategory,
      };
      this.props.onAddEvaluationCriteriaCategory(category);
    } else {
      this.setState({ evaluationCriteriaCategoryAlert: true });
    }
  };

  addTagCategoryButtonHandler = (event) => {
    event.preventDefault();
    let count = 0;

    this.props.tags.map((tag) => {
      if (tag.category.toLowerCase() === this.state.tagCategory.toLowerCase())
        count++;
    });

    if (count === 0) {
      this.setState({ tagCategoryAlert: false });
      let category = {
        category: this.state.tagCategory,
      };
      this.props.onAddTagCategory(category);
    } else {
      this.setState({ tagCategoryAlert: true });
    }
  };

  addSkillButtonHandler = (event, categoryId) => {
    event.preventDefault();
    if (event.target.value != null || event.target.value != "") {
      let count = 0;

      skillsData.map((data) => {
        if (data.categoryId == categoryId) {
          data.skillsArray.map((datum) => {
            if (datum.skill.toLowerCase() == this.state.skill.toLowerCase())
              count++;
          });
        }
      });

      if (count == 0) {
        let skill = {
          skill: this.state.skill,
        };

        this.props.onAddSkill(categoryId, skill);
      }
    }
  };

  addEvaluationCriteriaButtonHandler = (event, categoryId) => {
    event.preventDefault();
    if (event.target.value != null || event.target.value != "") {
      let count = 0;

      evaluationCriteriasData.map((data) => {
        if (data.categoryId == categoryId) {
          data.criteriasArray.map((datum) => {
            if (
              datum.criteria.toLowerCase() ==
              this.state.evaluationCriteria.toLowerCase()
            )
              count++;
          });
        }
      });

      if (count == 0) {
        let criteria = {
          criteria: this.state.evaluationCriteria,
        };

        this.props.onAddEvaluationCriteria(categoryId, criteria);
      }
    }
  };

  addTagButtonHandler = (event, categoryId) => {
    event.preventDefault();
    if (event.target.value != null || event.target.value != "") {
      let count = 0;

      tagsData.map((data) => {
        if (data.categoryId == categoryId) {
          data.tagsArray.map((datum) => {
            if (datum.tag.toLowerCase() == this.state.tag.toLowerCase())
              count++;
          });
        }
      });

      if (count == 0) {
        let tag = {
          tag: this.state.tag,
        };

        this.props.onAddTag(categoryId, tag);
      }
    }
  };

  removeSkillCategoryHandler = (event, categoryId) => {
    event.preventDefault();
    this.props.onRemoveSkillCategory(categoryId);
  };

  removeEvaluationCriteriaCategoryHandler = (event, categoryId) => {
    event.preventDefault();
    this.props.onRemoveEvaluationCriteriaCategory(categoryId);
  };

  removeTagCategoryHandler = (event, categoryId) => {
    event.preventDefault();
    this.props.onRemoveTagCategory(categoryId);
  };

  removeSkillFromCategoryHandler = (event, categoryId, skillId) => {
    event.preventDefault();
    this.props.onRemoveSkillFromCategory(categoryId, skillId);
  };

  removeEvaluationCriteriaFromCategoryHandler = (
    event,
    categoryId,
    criteriaId
  ) => {
    event.preventDefault();
    this.props.onRemoveEvaluationCriteriaFromCategory(categoryId, criteriaId);
  };

  removeTagFromCategoryHandler = (event, categoryId, tagId) => {
    event.preventDefault();
    this.props.onRemoveTagFromCategory(categoryId, tagId);
  };

  render() {
    let firstArray = Object.keys(this.props.skills).map(
      (key) => this.props.skills[key]
    );

    let secondArray = [];
    firstArray.map((name) => {
      secondArray.push({
        categoryId: name.id,
        category: name.category,
        skills: name.skills,
      });
    });

    skillsData = [];

    secondArray.map((pl) => {
      let array = [];
      for (let key in pl.skills) {
        array.push({ id: key, skill: pl.skills[key].skill });
      }
      skillsData.push({
        categoryId: pl.categoryId,
        category: pl.category,
        skillsArray: array,
      });
    });

    let firstArray1 = Object.keys(this.props.evaluationCriterias).map(
      (key) => this.props.evaluationCriterias[key]
    );

    let secondArray1 = [];
    firstArray1.map((name) => {
      secondArray1.push({
        categoryId: name.id,
        category: name.category,
        criterias: name.criterias,
      });
    });

    evaluationCriteriasData = [];

    secondArray1.map((pl) => {
      let array = [];
      for (let key in pl.criterias) {
        array.push({ id: key, criteria: pl.criterias[key].criteria });
      }
      evaluationCriteriasData.push({
        categoryId: pl.categoryId,
        category: pl.category,
        criteriasArray: array,
      });
    });

    let firstArray2 = Object.keys(this.props.tags).map(
      (key) => this.props.tags[key]
    );

    let secondArray2 = [];
    firstArray2.map((name) => {
      secondArray2.push({
        categoryId: name.id,
        category: name.category,
        tags: name.tags,
      });
    });

    tagsData = [];

    secondArray2.map((pl) => {
      let array = [];
      for (let key in pl.tags) {
        array.push({ id: key, tag: pl.tags[key].tag });
      }
      tagsData.push({
        categoryId: pl.categoryId,
        category: pl.category,
        tagsArray: array,
      });
    });

    return (
      <Card title="Settings">
        <MDBRow>
          <MDBCol md="4">
            <div className={classes.settingsCard}>
              <h4 style={{ textAlign: "center" }}>Skills</h4>
              <hr />

              <form>
                <input
                  className={classes.Input}
                  type="text"
                  name="propertyName"
                  placeholder="categories"
                  onChange={this.skillCategoryChangedHandler}
                  style={{ width: "100%" }}
                />
                {this.state.skillCategoryAlert ? (
                  <div style={{ width: "50%" }}>
                    <MDBAlert color="danger" dismiss style={{ height: "5%" }}>
                      It already exists!
                    </MDBAlert>
                  </div>
                ) : null}
                <MDBBtn
                  onClick={this.addSkillCategoryButtonHandler}
                  disabled={this.state.addSkillCategoryDisabled}
                  color="primary"
                >
                  ADD
                </MDBBtn>
              </form>

              {this.props.skills.map((skill) => {
                return (
                  <div
                    key={skill.id}
                    className={classes.settingsCard}
                    style={{ marginTop: "20px" }}
                  >
                    <MDBRow>
                      <MDBCol md="10">
                        <h5>{skill.category}</h5>
                      </MDBCol>
                      <MDBCol md="2">
                        <MDBCloseIcon
                          onClick={(event) =>
                            this.removeSkillCategoryHandler(event, skill.id)
                          }
                        />
                      </MDBCol>
                    </MDBRow>
                    <hr />

                    <form>
                      <input
                        className={classes.Input}
                        type="text"
                        name="propertyName"
                        placeholder="skill"
                        onChange={this.skillChangedHandler}
                        style={{ width: "100%" }}
                      />
                      {this.state.skillAlert ? (
                        <div style={{ width: "50%" }}>
                          <MDBAlert
                            color="danger"
                            dismiss
                            style={{ height: "5%" }}
                          >
                            It already exists!
                          </MDBAlert>
                        </div>
                      ) : null}
                      <MDBBtn
                        onClick={(event) =>
                          this.addSkillButtonHandler(event, skill.id)
                        }
                        color="primary"
                      >
                        ADD
                      </MDBBtn>
                    </form>

                    <div style={{ textAlign: "left", marginTop: "10px" }}>
                      {skillsData.map((data) => {
                        return skill.category == data.category
                          ? data.skillsArray.map((datum) => {
                              return (
                                <Chip
                                  className={classes.Chips}
                                  key={datum.id}
                                  label={datum.skill}
                                  onDelete={(event) =>
                                    this.removeSkillFromCategoryHandler(
                                      event,
                                      data.categoryId,
                                      datum.id
                                    )
                                  }
                                />
                              );
                            })
                          : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </MDBCol>

          <MDBCol md="4">
            <div className={classes.settingsCard}>
              <h4 style={{ textAlign: "center" }}>Evaluation Criterias</h4>
              <hr />

              <form>
                <input
                  className={classes.Input}
                  type="text"
                  name="criteriaCategoryName"
                  placeholder="categories"
                  onChange={this.evaluationCriteriaCategoryChangedHandler}
                  style={{ width: "100%" }}
                />
                {this.state.evaluationCriteriaCategoryAlert ? (
                  <div style={{ width: "50%" }}>
                    <MDBAlert color="danger" dismiss style={{ height: "5%" }}>
                      It already exists!
                    </MDBAlert>
                  </div>
                ) : null}
                <MDBBtn
                  onClick={this.addEvaluationCriteriaCategoryButtonHandler}
                  disabled={this.state.addEvaluationCriteriaCategoryDisabled}
                  color="primary"
                >
                  ADD
                </MDBBtn>
              </form>

              {this.props.evaluationCriterias.map((criteria) => {
                return (
                  <div
                    key={criteria.id}
                    className={classes.settingsCard}
                    style={{ marginTop: "20px" }}
                  >
                    <MDBRow>
                      <MDBCol md="10">
                        <h5>{criteria.category}</h5>
                      </MDBCol>
                      <MDBCol md="2">
                        <MDBCloseIcon
                          onClick={(event) =>
                            this.removeEvaluationCriteriaCategoryHandler(
                              event,
                              criteria.id
                            )
                          }
                        />
                      </MDBCol>
                    </MDBRow>
                    <hr />

                    <form>
                      <input
                        className={classes.Input}
                        type="text"
                        name="criteriaName"
                        placeholder="evaluation criteria"
                        onChange={this.evaluationCriteriaChangedHandler}
                        style={{ width: "100%" }}
                      />
                      <MDBBtn
                        onClick={(event) =>
                          this.addEvaluationCriteriaButtonHandler(
                            event,
                            criteria.id
                          )
                        }
                        color="primary"
                      >
                        ADD
                      </MDBBtn>
                    </form>

                    <div style={{ textAlign: "left", marginTop: "10px" }}>
                      {evaluationCriteriasData.map((data) => {
                        return criteria.category == data.category
                          ? data.criteriasArray.map((datum) => {
                              return (
                                <Chip
                                  className={classes.Chips}
                                  key={datum.id}
                                  label={datum.criteria}
                                  onDelete={(event) =>
                                    this.removeEvaluationCriteriaFromCategoryHandler(
                                      event,
                                      data.categoryId,
                                      datum.id
                                    )
                                  }
                                />
                              );
                            })
                          : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </MDBCol>

          <MDBCol md="4">
            <div className={classes.settingsCard}>
              <h4 style={{ textAlign: "center" }}>Tags</h4>
              <hr />

              <form>
                <input
                  className={classes.Input}
                  type="text"
                  name="tagCategoryName"
                  placeholder="tags"
                  onChange={this.tagCategoryChangedHandler}
                  style={{ width: "100%" }}
                />
                {this.state.tagCategoryAlert ? (
                  <div style={{ width: "50%" }}>
                    <MDBAlert color="danger" dismiss style={{ height: "5%" }}>
                      It already exists!
                    </MDBAlert>
                  </div>
                ) : null}
                <MDBBtn
                  onClick={this.addTagCategoryButtonHandler}
                  disabled={this.state.addTagCategoryDisabled}
                  color="primary"
                >
                  ADD
                </MDBBtn>
              </form>

              {this.props.tags.map((tag) => {
                return (
                  <div
                    key={tag.id}
                    className={classes.settingsCard}
                    style={{ marginTop: "20px" }}
                  >
                    <MDBRow>
                      <MDBCol md="10">
                        <h5>{tag.category}</h5>
                      </MDBCol>
                      <MDBCol md="2">
                        <MDBCloseIcon
                          onClick={(event) =>
                            this.removeTagCategoryHandler(event, tag.id)
                          }
                        />
                      </MDBCol>
                    </MDBRow>
                    <hr />

                    <form>
                      <input
                        className={classes.Input}
                        type="text"
                        name="tagName"
                        placeholder="tag"
                        onChange={this.tagChangedHandler}
                        style={{ width: "100%" }}
                      />
                      <MDBBtn
                        onClick={(event) =>
                          this.addTagButtonHandler(event, tag.id)
                        }
                        color="primary"
                      >
                        ADD
                      </MDBBtn>
                    </form>

                    <div style={{ textAlign: "left", marginTop: "10px" }}>
                      {tagsData.map((data) => {
                        return tag.category == data.category
                          ? data.tagsArray.map((datum) => {
                              return (
                                <Chip
                                  className={classes.Chips}
                                  key={datum.id}
                                  label={datum.tag}
                                  onDelete={(event) =>
                                    this.removeTagFromCategoryHandler(
                                      event,
                                      data.categoryId,
                                      datum.id
                                    )
                                  }
                                />
                              );
                            })
                          : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </MDBCol>
        </MDBRow>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    properties: state.properties,
    skills: state.skills,
    evaluationCriterias: state.evaluationCriterias,
    tags: state.tags,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSkills: () => dispatch(fetchSkills()),
    onAddSkillCategory: (category) => dispatch(addSkillCategory(category)),
    onAddSkill: (categoryId, skill) => dispatch(addSkill(categoryId, skill)),
    onRemoveSkillFromCategory: (categoryId, skillId) =>
      dispatch(removeSkillFromCategory(categoryId, skillId)),
    onRemoveSkillCategory: (categoryId) =>
      dispatch(removeSkillCategory(categoryId)),
    onFetchEvaluationCriterias: () => dispatch(fetchEvaluationCriterias()),
    onAddEvaluationCriteriaCategory: (category) =>
      dispatch(addEvaluationCriteriaCategory(category)),
    onAddEvaluationCriteria: (categoryId, criteria) =>
      dispatch(addEvaluationCriteria(categoryId, criteria)),
    onRemoveEvaluationCriteriaCategory: (categoryId) =>
      dispatch(removeEvaluationCriteriaCategory(categoryId)),
    onRemoveEvaluationCriteriaFromCategory: (categoryId, criteriaId) =>
      dispatch(removeEvaluationCriteriaFromCategory(categoryId, criteriaId)),
    onFetchTags: () => dispatch(fetchTags()),
    onAddTagCategory: (category) => dispatch(addTagCategory(category)),
    onAddTag: (categoryId, tag) => dispatch(addTag(categoryId, tag)),
    onRemoveTagCategory: (categoryId) =>
      dispatch(removeTagCategory(categoryId)),
    onRemoveTagFromCategory: (categoryId, tagId) =>
      dispatch(removeTagFromCategory(categoryId, tagId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
