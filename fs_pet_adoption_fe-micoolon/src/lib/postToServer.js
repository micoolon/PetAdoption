import axios from "axios";

async function postToServer(path, payload) {
  return axios
    .post(`http://localhost:4000/${path}`, payload)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      return { error: error, errMessage: error.response.data };
    });
}

export default postToServer;
