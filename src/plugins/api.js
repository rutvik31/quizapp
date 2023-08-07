import axiosInstance from "./axios";
import user from "@/services/user";
import tag from "@/services/tag";

export default {
  users: user(axiosInstance),
  tag: tag(axiosInstance),
};
