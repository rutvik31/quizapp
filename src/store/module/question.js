import api from "@/plugins/api";

const state = {
  questionsList: {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
  },
};

const getters = {};

const mutations = {
  setQuestionsList(state, { data, pagination }) {
    state.questionsList = {
      data,
      pagination,
    };
  },
  addQuestion(state, questionData) {
    state.questionsList.data.push(questionData);
  },
  updateQuestion(state, updatedQuestionData) {
    const index = state.questionsList.data.findIndex(
      (question) => question._id === updatedQuestionData._id
    );
    if (index !== -1) {
      state.questionsList.data.splice(index, 1, updatedQuestionData);
    }
  },
};

const actions = {
  async getQuestionsList(context, queryParams = {}) {
    return api.question.getQuestionsList(queryParams).then((res) => {
      context.commit("setQuestionsList", {
        data: res?.data?.data,
        pagination: res?.data?.pagination,
      });
    });
  },
  async createQuestion(context, questionData) {
    return api.question.createQuestionObject(questionData).then((res) => {
      context.commit("addQuestion", res?.data?.data);
    });
  },
  async updateQuestion(context, { questionId, questionData }) {
    return api.question.updateQuestion(questionId, questionData).then((res) => {
      context.commit("updateQuestion", res?.data?.data);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
