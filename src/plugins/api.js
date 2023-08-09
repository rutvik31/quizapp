import axiosInstance from "./axios";
import user from "@/services/user";
import tag from "@/services/tag";
import question from "@/services/question";

export default {
  users: user(axiosInstance),
  tag: tag(axiosInstance),
  question: question(axiosInstance),
};
