import { REGISTER, LOGIN, USER_DETAILS } from "@/utils/constants";

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
  });
