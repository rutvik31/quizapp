import { REGISTER, LOGIN, USER_DETAILS } from "@/utils/constants";

export default (axios) => ({
  createUserObject(user) {
    return axios.post(REGISTER, user);
  },
  getSingleUserObject(user) {
    return axios.post(LOGIN, user);
  },
  getUserDetails() {
    return axios.get(USER_DETAILS);
  },
});
