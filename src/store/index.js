import Vue from "vue";
import Vuex from "vuex";
import api from "../plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tagsList: [],
  },
  getters: {},
  mutations: {
    setTagsList(state, tags) {
      state.tagsList = tags;
    },
    addTag(state, tagData) {
      state.tagsList.push(tagData);
    },
    removeTag(state, tagId) {
      state.tagsList = state.tagsList.filter((tag) => tag._id !== tagId);
    },
  },
  actions: {
    getTagsList(context) {
      return api.tag.getTagsList().then((res) => {
        context.commit("setTagsList", res.data);
      });
    },
    createTag(context, tagData) {
      return api.tag.createTagObject(tagData).then((res) => {
        context.commit("addTag", res.data);
      });
    },
    deleteTag(context, tagId) {
      return api.tag.deleteSingleTagObject(tagId).then(() => {
        context.commit("removeTag", tagId);
      });
    },
  },
  modules: {},
});
