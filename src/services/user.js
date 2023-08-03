import { REGISTER, LOGIN } from "@/utils/constants";

export default (axios) => ({
  createUserObject(user) {
    return axios.post(REGISTER, user)
  },
  getSingleUserObject(user) {
    return axios.post(LOGIN, user)
  }
})