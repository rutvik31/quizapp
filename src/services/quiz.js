import { CREATE_QUIZ, GET_QUIZ, GET_QUIZ_OBJECT } from "@/utils/constants";

export default (axios) => ({
  createQuizObject(payload) {
    return axios.post(CREATE_QUIZ, payload);
  },
  getQuizList(queryParams) {
    return axios.get(GET_QUIZ, { params: queryParams });
  },
  getQuizById(id) {
    return axios.get(`${GET_QUIZ_OBJECT}/${id}`);
  },
});
