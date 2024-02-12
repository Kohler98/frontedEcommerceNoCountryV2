import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm/useForm";
import crudAxios from "../../config/axios";
import { CRMContext } from "../context/CRMcontext";
import { Country, State, City } from "country-state-city";

export default function SignUp() {
  const { formState, onInputChange } = useForm({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    role: "USER_ROLE",
    pais: "",
    ciudad: "",
    estado: "",
  });
  const [auth, setAuth] = useContext(CRMContext);
  const [errors, setErrors] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/me");
    }
  }, [auth]);

  useEffect(() => {
    if (formState.pais) {
      const fetchedStates = State.getStatesOfCountry(formState.pais);
      setStates(fetchedStates);
      setCities([]); // Reset cities when country changes
    } else {
      setStates([]);
      setCities([]); // Reset cities when there is no country selected
    }
  }, [formState.pais]);

  useEffect(() => {
    if (formState.estado) {
      const fetchedCities = City.getCitiesOfState(
        formState.pais,
        formState.estado
      );
      setCities(fetchedCities);
    } else {
      setCities([]);
    }
  }, [formState.estado]);

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await crudAxios.post("/signup", formState);
      console.log(respuesta.data);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Update the state with the errors
      }
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-4/5 md:w-2/4 lg:w-1/3 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={crearUsuario} className="grid grid-cols-2 ">
          <div className="floating-label-group col-span-2 mx-2">
            <input
              type="text"
              id="firstName"
              name="nombre"
              value={formState.nombre}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Nombre"
            />
            <label htmlFor="firstName" className="block bg-gray-100">
              Name
            </label>
          </div>

          <div className="floating-label-group col-span-2 mx-2">
            {" "}
            <input
              type="text"
              id="lastName"
              name="apellido"
              value={formState.apellido}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Apellido"
            />
            <label htmlFor="lastName" className="block bg-gray-100">
              Last Name
            </label>
          </div>

          <div className="floating-label-group col-span-2 mx-2">
            {" "}
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Email"
            />
            <label htmlFor="email" className="block bg-gray-100">
              Email
            </label>
          </div>

          {/* Country Select Field */}
          <div className="floating-label-group col-span-2 mx-2">
            <select
              name="pais"
              value={formState.pais}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5"
            >
              <option value="">Country</option>
              {Country.getAllCountries().map((country, index) => (
                <option key={index} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            <label htmlFor="pais" className="block bg-gray-100">
              Country
            </label>
          </div>

          {/* State Select Field */}
          <div className="floating-label-group col-span-2 mx-2">
            <select
              name="estado"
              value={formState.estado}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5"
              disabled={!states.length}
            >
              <option value="">State</option>
              {states.map((state, index) => (
                <option key={index} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <label htmlFor="estado" className="block bg-gray-100">
              State
            </label>
          </div>

          {/* City Select Field */}
          <div className="floating-label-group col-span-2 mx-2">
            <select
              name="ciudad"
              value={formState.ciudad}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5"
              disabled={!cities.length}
            >
              <option value="">City</option>
              {cities.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <label htmlFor="ciudad" className="block bg-gray-100">
              City
            </label>
          </div>

          <div className="floating-label-group col-span-2 md:col-span-1 mx-2">
            {" "}
            <input
              type="password"
              id="password"
              name="password"
              value={formState.password}
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Contraseña"
            />
            <label htmlFor="password" className="block bg-gray-100">
              Password
            </label>
          </div>
          <div className="floating-label-group col-span-2 md:col-span-1 mx-2">
            {" "}
            <input
              type="password"
              id="confirmPassword"
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Confirmar Contraseña"
            />
            <label htmlFor="confirmPassword" className="block bg-gray-100">
              Confirm Password
            </label>
          </div>
          <div className="col-span-2 flex flex-col items-center">
            <button
              className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
            >
              Sign Up
            </button>
            <Link
              to="/signin"
              className="inline-block align-baseline font-bold text-sm text-gray-950 hover:text-gray-900"
            >
              I already have an account.
            </Link>
          </div>
        </form>
        {errors.length > 0 && (
          <div className="mt-10 absolute">
            {errors.map((err, index) => (
              <p key={index} className="text-red-600 ">
                {err.msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
