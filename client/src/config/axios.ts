import Axios, { AxiosRequestConfig } from "axios";

import { RootState, store } from "../store";

function select(state: RootState) {
  return state.persistedReducer.auth.token;
}

let baseURL;
if (process.env.NODE_ENV === "production") {
  baseURL =
    "http://ec2-13-127-122-214.ap-south-1.compute.amazonaws.com:3001/v1/api";
} else {
  baseURL = "http://localhost:3001/v1/api";
}

const axiosParams: AxiosRequestConfig = {
  baseURL,
};

const request = Axios.create(axiosParams);

request.interceptors.request.use(
  (config) => {
    const token = select(store.getState());
    if (token) {
      config.headers.common = {
        ...config.headers.common,
        Authorization: "Bearer " + token,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { request };
