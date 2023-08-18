import api from "@/plugins/api";

const state = {
  token: localStorage.getItem("token") || null,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem("token", token);
  },
};

const actions = {
  login({ commit }, user) {
    return api.users
      .getSingleUserObject(user)
      .then((res) => {
        const token = res?.data?.token;
        commit("SET_TOKEN", token);
        return Promise.resolve();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
