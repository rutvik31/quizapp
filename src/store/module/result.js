import api from "@/plugins/api";

const state = {
  resultsList: {
    data: [],
    // pagination: {
    //   currentPage: 1,
    //   totalPages: 1,
    //   totalItems: 0,
    // },
  },
};

const getters = {};

const mutations = {
  setResultList(state, { data, pagination }) {
    state.resultsList = {
      data,
      // pagination,
    };
  },
};

const actions = {
  async getResultsList(context, userId) {
    return api.user.getResult(userId).then((res) => {
      context.commit("setResultList", {
        data: res?.data?.data,
        // pagination: res?.data?.pagination,
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
