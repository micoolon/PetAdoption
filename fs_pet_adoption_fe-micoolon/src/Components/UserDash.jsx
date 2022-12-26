import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppContext from "../context/AppContext";
import axios from "axios";

function UserDash() {
  const appContext = useContext(AppContext);
  const user = appContext.user;
  const [errorMessage, setErrorMessage] = useState();
  const [userList, setUserList] = useState();
  const [expandedUser, setExpandedUser] = useState();
  const [userPetList, setUserPetList] = useState();
  let { id } = useParams();

  const getUsers = () => {
    axios
      .get(`http://localhost:4000/user`, {
        headers: {
          Authorization: "Bearer " + user.token,
          id: user.id,
        },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setErrorMessage("No Users Found!");
        } else {
          setUserList(response.data);
        }
      });
  };

  const getPets = (id) => {
    axios.get(`http://localhost:4000/pet/user/${id}`).then((response) => {
      if (response.data.length !== 0) {
        setUserPetList(response.data);
      } else {
        setUserPetList(null);
      }
    });
  };

  const expandCard = (id) => {
    getPets(id);
    setExpandedUser(id);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      {errorMessage}
      <div className="userList">
        {userList && (
          <>
            {userList.map((userItem) => {
              return (
                <>
                  <div key={userItem.id} className="userCard">
                    <div
                      className="userItem"
                      onClick={async () => {
                        expandCard(userItem.id);
                      }}
                    >
                      <div className="userSection">
                        <p className="userSectionHead">ID</p>
                        <p>{userItem.id}</p>
                      </div>
                      <div className="userSection">
                        <p className="userSectionHead">NAME</p>
                        <p>{userItem.first_name}</p>
                        <p>{userItem.last_name}</p>
                      </div>
                      <div className="userSection">
                        <p className="userSectionHead">Email</p>
                        <p>{userItem.email}</p>
                      </div>
                      <div className="userSection">
                        <p className="userSectionHead">Phone</p>
                        <p>{userItem.phone}</p>
                      </div>
                      <div className="userSection" style={{ borderRight: 0 }}>
                        <p className="userSectionHead">Role</p>
                        {userItem.isAdmin === "true" && <p>Admin</p>}
                        {userItem.isAdmin !== "true" && <p>User</p>}
                      </div>
                    </div>
                    {expandedUser === userItem.id && (
                      <div className="userCardPets">
                        <p>Owned Pets</p>
                        {userPetList &&
                          userPetList.length > 0 &&
                          userPetList.map((petItem) => {
                            return (
                              <div className="userCardPetList">
                                <div key={petItem.UID}>
                                  <Link
                                    className="userPetLink"
                                    to={`/Pet/${petItem.seqNumber}`}
                                  >
                                    <img
                                      className="userPetImage"
                                      src={`${petItem.imageUrl}`}
                                    />
                                    <p>{petItem.name}</p>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default UserDash;
