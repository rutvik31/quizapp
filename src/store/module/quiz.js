import api from "@/plugins/api";

const state = {
  quizList: {
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
  setQuizList(state, { data, pagination }) {
    state.quizList = {
      data,
      pagination,
    };
  },
  addQuiz(state, quizData) {
    state.quizList.data.push(quizData);
  },
};

const actions = {
  async getQuizList(context, queryParams = {}) {
    return api.quiz.getQuizList(queryParams).then((res) => {
      context.commit("setQuizList", {
        data: res?.data?.data,
        pagination: res?.data?.pagination,
      });
    });
  },
  async createQuiz(context, quizData) {
    return api.quiz.createQuizObject(quizData).then((res) => {
      context.commit("addQuiz", res?.data?.data);
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
