import Vue from "vue";
import Vuex from "vuex";
import tagsModule from "@/store/module/tag";
import questionsModule from "@/store/module/question";
import quizModule from "@/store/module/quiz";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tags: tagsModule,
    questions: questionsModule,
    quiz: quizModule,
  },
});
