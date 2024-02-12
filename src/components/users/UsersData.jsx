import React, { useContext, useEffect, useState } from "react";
import crudAxios from "../../config/axios";
import { FaUser, FaRegEdit } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { RiDeleteBin7Line, RiDeleteBin7Fill } from "react-icons/ri";
import { CRMContext } from "../context/CRMcontext";
import { useNavigate } from "react-router";

export default function UsersData({ setIsEditing, setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [moth, setMoth] = useState([]);
  const [auth, setAuth] = useContext(CRMContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page
  const [hoveredItemId, setHoveredItemId] = useState(null);

  useEffect(() => {
    const fetchMoths = async () => {
      try {
        const { token } = auth;
        if (!token) {
          console.error("No token found");
          setIsLoading(false);
          return;
        }

        const config = {
          headers: { "x-token": token },
        };

        const res = await crudAxios.get(
          "/invoice/selected/total/month",
          config
        );
        console.log(res.data);
        setMoth(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoths();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { token } = auth;
        if (!token) {
          console.error("No token found");
          setIsLoading(false);
          return;
        }

        const config = {
          headers: { "x-token": token },
        };

        const res = await crudAxios.get("/admin/users", config);
        console.log(res.data);
        setUsers(res.data.map((user) => ({ ...user, imageError: false })));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleResumenSellsMonths = async (e) => {
    try {
      e.preventDefault();
      const { token } = auth;

      const headers = { "x-token": token, "Content-Type": "blob" };
      const data = { mes: "enero" };
      const config = { method: "GET", responseType: "blob", headers, data };
      ////invoice/total/:id -> PARA DESCARGAR EXCEL POR USUARIO
      const res = await crudAxios.get(`/invoice/total/resume`, config);
      const blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Resemen_Ventas_Total.xlsx";
      link.click();
    } catch (error) {
      console.error("Error downloading excel:", error);
    }
  };
  const handleImageError = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, imageError: true };
        }
        return user;
      })
    );
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
  };

  const lastUserIndex = currentPage * usersPerPage;
  const firstUserIndex = lastUserIndex - usersPerPage;
  const currentUsers = users.slice(firstUserIndex, lastUserIndex);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-72">
        <TailSpin color="#030712" height={50} width={50} />
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-4 max-w-[400px] md:max-w-[800px] pt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Registered Users</h2>

      <form action="" onSubmit={handleResumenSellsMonths}>
        <input type="submit" value="Descargar Resumen mensual" />
      </form>
      <ul>
        {currentUsers.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between mb-2.5 bg-white p-4 rounded shadow"
          >
            {/* User details */}
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full overflow-hidden">
                {user.imagen && !user.imageError ? (
                  <img
                    src={`${
                      import.meta.env.VITE_APP_BACKEND_URL
                    }/uploads/users/${user.imagen}?${new Date().getTime()}`}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(user.id)}
                  />
                ) : (
                  <FaUser className="text-gray-400" size={24} />
                )}
              </div>
              <div className="ml-4 text-gray-700">
                <p className="font-semibold capitalize">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            {/* Edit and Delete buttons */}
            <div className="flex items-center">
              {/* Edit button */}
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEditUser(user)}
              >
                <FaRegEdit />
              </button>
              {/* Delete button */}
              <button
                className="text-red-500"
                onClick={() => deleteUser(user.id)}
                onMouseEnter={() => setHoveredItemId(user.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                {hoveredItemId === user.id ? (
                  <RiDeleteBin7Fill />
                ) : (
                  <RiDeleteBin7Line />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-2 px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-gray-950 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
