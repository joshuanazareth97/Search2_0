import Axios from "axios";

import { RootState, store } from "../store";

function select(state: RootState) {
  return state.persistedReducer.auth.token;
}

let baseURL;
if (process.env.NODE_ENV === "production") {
} else {
  baseURL = "http://localhost:3001/v1/api";
}

const request = Axios.create({
  baseURL,
});

export { request };
