import React, { useContext, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { RiDeleteBin7Line, RiDeleteBin7Fill } from "react-icons/ri";
import { CRMContext } from "../context/CRMcontext";
import crudAxios from "../../config/axios";
import { GoArrowLeft } from "react-icons/go";

const UserData = ({ user, setIsEditing, onBackToList, setImageUploaded }) => {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [auth, setAuth] = useContext(CRMContext);
  const [users, setUsers] = useState([]);
  const referenciaImg = useRef();

  const deleteUser = async (userId) => {
    try {
      const { token } = auth;
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: { "x-token": token },
      };

      await crudAxios.delete(`/admin/user/${userId}`, config);
      // Update the users state to remove the deleted user
      setUsers(users.filter((user) => user.id !== userId));
      // You may want to add additional UI feedback here
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error (e.g., show error message)
    }
  };

  const leerImagen = async (e) => {
    const formData = new FormData();
    formData.append("imagen", e.target.files[0]);

    try {
      const { token } = auth;
      // Example showing userId being used in the URL endpoint
      const endpoint = `/admin/users/${user.id}/profile-image`;
      const config = {
        headers: {
          "x-token": token,
          "Content-Type": "multipart/form-data",
        },
      };

      await crudAxios.post(endpoint, formData, config);
      setImageUploaded(true); // Trigger refresh or re-fetch of user data
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const calculateTotalPrice = (pedido) => {
    let totalPrice = 0;
    pedido.productos.forEach((producto) => {
      totalPrice += producto.precio * producto.cantidad;
    });
    return totalPrice;
  };

  console.log(user);

  return (
    <div className="mx-auto px-4 py-4 max-w-[400px] md:max-w-[800px]">
      <button
        onClick={onBackToList} // Use the passed callback function to navigate back
      >
        <GoArrowLeft size={24} />
      </button>

      <button
        className="text-red-500"
        onClick={() => deleteUser(user.id) && onBackToList()}
        onMouseEnter={() => setHoveredItemId(user.id)}
        onMouseLeave={() => setHoveredItemId(null)}
      >
        {hoveredItemId === user.id ? (
          <RiDeleteBin7Fill />
        ) : (
          <RiDeleteBin7Line />
        )}
      </button>

      <div className="p-4 bg-white shadow-sm rounded-lg overflow-hidden">
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
          {user.imagen ? (
            <img
              src={`${import.meta.env.REACT_APP_BACKEND_URL}/uploads/users/${
                user.imagen
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
          {user.nombre} {user.apellido}
        </h2>

        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-700">Role:</span>{" "}
            {user.role === "USER_ROLE" ? "User" : "Admin"}
          </p>
          <p className="capitalize">
            <span className="font-medium text-gray-700">Country:</span>{" "}
            {user.pais}
          </p>
          <p className="capitalize">
            <span className="font-medium text-gray-700">State:</span>{" "}
            {user.estado}
          </p>
          <p className="capitalize">
            <span className="font-medium text-gray-700">City:</span>{" "}
            {user.ciudad}
          </p>
          <p>
            <span className="font-medium text-gray-700">Member Since:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-950 hover:bg-gray-900 focus:outline-none"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        {/* Order display here */}
        {user.pedidos && user.pedidos.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            {user.pedidos.map((pedido, index) => (
              <div
                key={index}
                className="mb-6 bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <div className="flex p-4 border-b justify-between">
                  <h3 className="font-semibold p-2">
                    {new Date(pedido.createdAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <p className="font-bold p-2">
                    Total: ${calculateTotalPrice(pedido)}
                  </p>
                </div>

                {pedido.productos.map((producto, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-4 border-b last:border-b-0 text-start"
                  >
                    <img
                      src={`${
                        import.meta.env.REACT_APP_BACKEND_URL
                      }/uploads/products/${producto.imagen}`}
                      alt={producto.titulo}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-bold">{producto.titulo}</p>
                      <p>Quantity: {producto.cantidad}</p>
                      <p>Price: ${producto.precio}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserData;
