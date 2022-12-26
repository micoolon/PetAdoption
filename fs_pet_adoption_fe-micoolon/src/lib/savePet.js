import axios from "axios";

async function savePet(petId, user) {
  return axios
    .post(`http://localhost:4000/pet/${petId}/save`, user, {
      headers: {
        Authorization: "Bearer " + user.token,
        id: user.id,
      },
    })
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      return { error: error, errMessage: error.response.data };
    });
}
export default savePet;
