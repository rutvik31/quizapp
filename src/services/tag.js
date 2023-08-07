import { CREATE_TAG } from "@/utils/constants";

export default (axios) => ({
  createTagObject(tag) {
    return axios.post(CREATE_TAG, tag);
  },
});
