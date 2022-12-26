import axios from "axios";

async function deleteSavedPet(petId, user) {
  return axios
    .delete(`http://localhost:4000/pet/${petId}/save`, {
      data: {
        user: user,
      },
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
export default deleteSavedPet;
