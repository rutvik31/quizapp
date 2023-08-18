import { CREATE_TAG, GET_TAG, DELETE_TAG } from "@/utils/constants";

export default (axios) => ({
  createTagObject(tag) {
    return axios.post(CREATE_TAG, tag);
  },
  getTagsList(queryParams) {
    return axios.get(GET_TAG, { params: queryParams });
  },
  deleteSingleTagObject(id) {
    return axios.delete(`${DELETE_TAG}/${id}`);
  },
});
