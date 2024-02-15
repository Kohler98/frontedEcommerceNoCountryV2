import React, { useContext, useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm/useForm";
import crudAxios from "../../config/axios";
import { Country, State, City } from "country-state-city";
import { CRMContext } from "../context/CRMcontext";

export default function EditUserData({ user, setIsEditing, setSelectedUser, onUpdateUser }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [auth, setAuth] = useContext(CRMContext);

  const { formState, onInputChange, onResetForm } = useForm({
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    pais: user.pais,
    estado: user.estado || "",
    ciudad: user.ciudad || "",
    password: "",
  });

  useEffect(() => {
    if (formState.pais) {
      const fetchedStates = State.getStatesOfCountry(formState.pais);
      setStates(fetchedStates);
    } else {
      setStates([]);
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
  }, [formState.estado, formState.pais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };
      await crudAxios.put(`/admin/user/${user.id}`, formState, config);
      setIsEditing(false);
      if (onUpdateUser) {
        onUpdateUser(); // Call the update function to refresh user data
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="pt-10">
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md md:max-w-lg bg-white px-4 py-8 shadow-lg rounded space-y-4"
        >
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formState.nombre}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formState.apellido}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="pais"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <select
              id="pais"
              name="pais"
              value={formState.pais}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
            >
              <option value="">Select a country</option>
              {Country.getAllCountries().map((country, index) => (
                <option key={index} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <select
              id="estado"
              name="estado"
              value={formState.estado}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
              disabled={states.length === 0}
            >
              <option value="">Select a state</option>
              {states.map((state, index) => (
                <option key={index} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="ciudad"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <select
              id="ciudad"
              name="ciudad"
              value={formState.ciudad}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
              disabled={cities.length === 0}
            >
              <option value="">Select a city</option>
              {cities.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formState.password}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col justify-between items-center">
            <button
              type="submit"
              className="w-full mb-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-950 hover:bg-gray-900 focus:outline-none"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                onResetForm();
              }}
              className="w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
