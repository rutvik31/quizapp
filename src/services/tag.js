import { CREATE_TAG, GET_TAG, DELETE_TAG } from "@/utils/constants";

export default (axios) => ({
  createTagObject(tag) {
    return axios.post(CREATE_TAG, tag);
  },
  getTagsList() {
    return axios.get(GET_TAG);
  },
  deleteSingleTagObject(id) {
    return axios.delete(`${DELETE_TAG}/${id}`);
  },
});
