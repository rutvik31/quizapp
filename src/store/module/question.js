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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
