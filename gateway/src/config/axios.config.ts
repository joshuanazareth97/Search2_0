import Axios from "axios";

let baseURL;
if (process.env.NODE_ENV === "production") {
  baseURL = "http://35.154.183.189:8080/api/v2";
} else {
  baseURL = "http://35.154.183.189:8080/api/v2";
}

const davinciClient = Axios.create({
  baseURL,
});

const askQuestion = async (query: string, userID: string) => {
  return await davinciClient.post("/search", {
    query,
    userID,
  });
};

export { davinciClient, askQuestion };
