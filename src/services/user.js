import {
  REGISTER,
  LOGIN,
  USER_DETAILS,
  SUBMIT_QUIZ,
  GET_RESULT,
} from "@/utils/constants";

export default (axios) => ({
  register(user) {
    return axios.post(REGISTER, user);
  },
  login(user) {
    return axios.post(LOGIN, user);
  },
  getUserDetails() {
    return axios.get(USER_DETAILS);
  },
  submitQuiz(user) {
    return axios.post(SUBMIT_QUIZ, user);
  },
  getResult(userId) {
    return axios.get(`${GET_RESULT}/${userId}`);
  },
});
