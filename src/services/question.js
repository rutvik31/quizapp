import {
  CREATE_QUESTION,
  BULK_UPLOAD_QUESTIONS,
  GET_QUESTIONS,
  GET_QUESTION_BY_ID,
  EDIT_QUESTION,
} from "@/utils/constants";

export default (axios) => ({
  createQuestionObject(question) {
    return axios.post(CREATE_QUESTION, question);
  },
  bulkUploadQuestions(questions) {
    return axios.post(BULK_UPLOAD_QUESTIONS, questions);
  },
  getQuestionsList(queryParams) {
    return axios.get(GET_QUESTIONS, { params: queryParams });
  },
  getQuestionById(id) {
    return axios.get(`${GET_QUESTION_BY_ID}/${id}`);
  },
  updateQuestion(id, payload) {
    return axios.put(`${EDIT_QUESTION}/${id}`, payload);
  },
});
