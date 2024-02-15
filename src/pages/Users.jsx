import React, { useContext, useEffect, useState } from "react";
import UserList from "../components/users/UserList"; // Adjust the import path as necessary
import UserData from "../components/users/UserData"; // Adjust the import path as necessary
import EditUserData from "../components/users/EditUserData"; // Adjust the import path as necessary
import crudAxios from "../config/axios";
import { CRMContext } from "../components/context/CRMcontext";

const Users = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'view', or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [auth] = useContext(CRMContext);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = auth;
        const config = { headers: { "x-token": token } };
        const res = await crudAxios.get("/me", config);
        setUserData(res.data);
        setImageUploaded(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [imageUploaded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCurrentView("view");
  };

  const handleEdit = () => {
    setCurrentView("edit");
  };

  const handleCancelEdit = () => {
    setCurrentView("view");
  };

  const handleSaveEdit = async (userId) => {
    try {
      const { data } = await crudAxios.get(`/admin/user/${userId}`, {
        headers: { "x-token": auth.token },
      });
      setSelectedUser(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  return (
    <>
      {currentView === "list" && <UserList onSelectUser={handleSelectUser} />}
      {currentView === "view" && selectedUser && (
        <UserData
          user={selectedUser}
          setIsEditing={handleEdit}
          onBackToList={() => setCurrentView("list")}
          setImageUploaded={setImageUploaded}
        />
      )}
      {currentView === "edit" && selectedUser && (
        <EditUserData
          user={selectedUser}
          setIsEditing={handleCancelEdit}
          setSelectedUser={setSelectedUser}
          setUserData={setUserData}
          onUpdateUser={() => handleSaveEdit(selectedUser.id)}
        />
      )}{" "}
    </>
  );
};

export default Users;
