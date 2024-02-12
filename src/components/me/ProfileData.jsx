import React, { useContext, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import crudAxios from "../../config/axios";
import { CRMContext } from "../context/CRMcontext";

const ProfileData = ({ userData, setIsEditing, setImageUploaded }) => {
  const referenciaImg = useRef();
  const [auth, setAuth] = useContext(CRMContext);
  const leerImagen = async (e) => {
    const formData = new FormData();
    formData.append("imagen", e.target.files[0]);
    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };

      const res = await crudAxios.post(
        "/users/me/profile-image",
        formData,
        config
      );
      console.log(res);
      setImageUploaded(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="mx-auto px-4 py-4 max-w-[400px] md:max-w-[800px]">
      <div className="text-center mb-6">
        <input
          type="file"
          name="imagen"
          onChange={leerImagen}
          style={{ display: "none" }}
          ref={referenciaImg}
        />
        <button
          className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center"
          onClick={() => referenciaImg.current.click()}
        >
          {userData.usuario.imagen ? (
            <img
              src={`${import.meta.env.VITE_APP_BACKEND_URL}/uploads/users/${
                userData.usuario.imagen
              }`}
              alt="User"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-3xl">
              <FaCamera />
            </span>
          )}
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 capitalize">
          {userData.usuario.nombre} {userData.usuario.apellido}
        </h2>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-medium text-gray-700">Email:</span>{" "}
          {userData.usuario.email}
        </p>
        <p>
          <span className="font-medium text-gray-700">Password:</span> ******
        </p>
        <p>
          <span className="font-medium text-gray-700">Role:</span>{" "}
          {userData.usuario.role === "USER_ROLE" ? "User" : "Admin"}
        </p>
        <p className="capitalize">
          <span className="font-medium text-gray-700">Country:</span>{" "}
          {userData.usuario.pais}
        </p>
        <p className="capitalize">
          <span className="font-medium text-gray-700">State:</span>{" "}
          {userData.usuario.estado}
        </p>
        <p className="capitalize">
          <span className="font-medium text-gray-700">City:</span>{" "}
          {userData.usuario.ciudad}
        </p>
        <p>
          <span className="font-medium text-gray-700">Member Since:</span>{" "}
          {new Date(userData.usuario.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-950 hover:bg-gray-900 focus:outline-none"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ProfileData;
