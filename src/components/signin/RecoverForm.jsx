import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm/useForm";
import crudAxios from "../../config/axios";

export default function RecoverPassword() {
  const { formState, onInputChange } = useForm({ email: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const handleRecuperarContrasena = async (e) => {
    e.preventDefault();
    try {
      const res = await crudAxios.post("/forgot-password", formState);

      console.log(res.data);
      // Mostrar mensaje de éxito o redirigir a una página de éxito
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-4/5 md:w-2/4 lg:w-1/3 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Recover Password
        </h2>
        <form onSubmit={handleRecuperarContrasena}>
          <div className="floating-label-group">
            <input
              type="email"
              id="email"
              value={formState.email}
              name="email"
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Email"
            />
            <label htmlFor="email" className="block bg-gray-100">
              Email
            </label>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
            >
              Send Recover Link
            </button>
            <Link
              to="/signin"
              className="inline-block align-baseline font-bold text-sm text-gray-950 hover:text-gray-900"
            >
              Go Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
