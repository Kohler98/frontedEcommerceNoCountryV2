import React, { useEffect, useState, useRef, useContext } from "react";
import crudAxios from "../config/axios";
import ProfileData from "../components/me/ProfileData";
import { EditProfileData } from "../components/me/EditProfileData";
import { TailSpin } from "react-loader-spinner";
import { CRMContext } from "../components/context/CRMcontext";

export default function Me() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [auth, setAuth] = useContext(CRMContext);
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

  if (!userData) {
    return (
      <div className="flex justify-center pt-40">
        <TailSpin color="#030712" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex justify-center py-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-5">
        {isEditing ? (
          <EditProfileData
            userData={userData}
            setUserData={setUserData}
            setIsEditing={setIsEditing}
          />
        ) : (
          <ProfileData
            userData={userData}
            setIsEditing={setIsEditing}
            setImageUploaded={setImageUploaded}
          />
        )}
      </div>
    </div>
  );
}
