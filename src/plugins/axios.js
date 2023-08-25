import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

// Axios interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (req) => {
    if (req.url === "/login" || req.url === "/register") {
      return req;
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        req.headers.Authorization = token;
      }
      return req;
    }
  },
  (error) => {
    return error;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.clear();
      window.location = "/login";
    }
    return error;
  }
);

export default axiosInstance;
