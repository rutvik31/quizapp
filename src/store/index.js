import Vue from "vue";
import Vuex from "vuex";
import auth from "@/store/module/auth";
import tagsModule from "@/store/module/tag";
import questionsModule from "@/store/module/question";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    tags: tagsModule,
    questions: questionsModule,
  },
});
