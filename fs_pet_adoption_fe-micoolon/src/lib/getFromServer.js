import axios from "axios";

async function getFromServer(path) {
  return axios
    .get(`http://localhost:4000/${path}`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      return { error: error, errMessage: error.response.data };
    });
}

export default getFromServer;
