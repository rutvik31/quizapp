import {
  REGISTER,
  LOGIN,
  USER_DETAILS,
  CREATE_SCORE,
  GET_SCORE,
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
  createUserQuizScore(user) {
    return axios.post(CREATE_SCORE, user);
  },
  getUserQuizScore(id) {
    return axios.get(`${GET_SCORE}/${id}`);
  },
});
