import { CREATE_QUESTION, GET_QUESTIONS } from "@/utils/constants";

export default (axios) => ({
  createQuestionObject(question) {
    return axios.post(CREATE_QUESTION, question);
  },
  getQuestionsList() {
    return axios.get(GET_QUESTIONS);
  },
});
