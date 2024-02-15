import React, { useContext, useEffect, useState } from "react";
import crudAxios from "../../config/axios";
import { FaUser } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { RiDeleteBin7Line, RiDeleteBin7Fill } from "react-icons/ri";
import { CRMContext } from "../context/CRMcontext";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [auth] = useContext(CRMContext);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState([]);

  useEffect(() => {
    const fetchMonths = async () => {
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
        setMonth(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonths();
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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth.token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      try {
        const config = {
          headers: { "x-token": auth.token },
        };
        const res = await crudAxios.get("/admin/users", config);
        setUsers(res.data.map((user) => ({ ...user, imageError: false })));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [auth.token]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center pt-72">
        <TailSpin color="#030712" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-[400px] md:max-w-[800px] pt-10">
      <form action="" onSubmit={handleResumenSellsMonths}>
        <input type="submit" value="Descargar Resumen mensual" />
      </form>

      <h2 className="text-2xl font-bold mb-4 text-center">Registered Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between mb-2.5 bg-white p-4 rounded shadow"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full overflow-hidden">
                {user.imagen && !user.imageError ? (
                  <img
                    src={`${
                      import.meta.env.VITE_APP_BACKEND_URL
                    }/uploads/users/${user.imagen}`}
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
            <div className="flex items-center">
              <button
                className="text-blue-500 mr-2"
                onClick={() => onSelectUser(user)}
              >
                Show info
              </button>
              {/* Delete functionality and other user actions can be implemented here */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
