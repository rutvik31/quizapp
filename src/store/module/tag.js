import api from "@/plugins/api";

const state = {
  tagsList: {
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
  setTagsList(state, { data, pagination }) {
    state.tagsList = {
      data,
      pagination,
    };
  },
  addTag(state, tagData) {
    state.tagsList.push(tagData);
  },
  removeTag(state, tagId) {
    state.tagsList = state.tagsList.filter((tag) => tag._id !== tagId);
  },
};

const actions = {
  async getTagsList(context, queryParams = {}) {
    return api.tag.getTagsList(queryParams).then((res) => {
      context.commit("setTagsList", {
        data: res?.data?.data,
        pagination: res?.data?.pagination,
      });
    });
  },
  createTag(context, tagData) {
    return api.tag.createTagObject(tagData).then((res) => {
      context.commit("addTag", res?.data?.data);
    });
  },
  deleteTag(context, tagId) {
    return api.tag.deleteSingleTagObject(tagId).then(() => {
      context.commit("removeTag", tagId);
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
