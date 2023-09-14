import axiosInstance from "./axios";
import user from "@/services/user";
import tag from "@/services/tag";
import question from "@/services/question";
import quiz from "@/services/quiz";

export default {
  user: user(axiosInstance),
  tag: tag(axiosInstance),
  question: question(axiosInstance),
  quiz: quiz(axiosInstance),
};
