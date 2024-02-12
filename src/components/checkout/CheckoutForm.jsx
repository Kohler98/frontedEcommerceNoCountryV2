import React, { useContext, useEffect, useState } from "react";
import { countries } from "../../config/countries";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const CheckoutForm = ({formulario}) => {
  const { cartItems } = useContext(CartContext);
  const [formState,onInputChange] = formulario
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

 

  useEffect(()=>{

    if(formState.pais.length>0){
      const consultarApi = async () => {
        try {
 
          const res = await axios.get(`https://www.universal-tutorial.com/api/states/${formState.pais}`,{
            headers:{
              "Authorization":import.meta.env.VITE_APP_COUNTRY_API,
              "Accept":"application/json"
            }
          })
          const estados = res.data.map(estado=> estado.state_name)
        
          setStates(estados)
 
        } catch (error) {
          console.log(error);
          return [];
        }
      };
      consultarApi();

 

    }
  },[formState.pais])

  useEffect(()=>{
    if(formState.estado.length>0){
      const consultarApi = async () => {
        try {
          console.log(formState.estado)
          const res = await axios.get(`https://www.universal-tutorial.com/api/cities/${formState.estado}`,{
            headers:{
              "Authorization":import.meta.env.VITE_APP_COUNTRY_API,
              "Accept":"application/json"
            }
          })

          const ciudades = res.data.map(ciudad=> ciudad.city_name)
        
          setCities(ciudades)
        // Notify parent component that data is loaded
        } catch (error) {
          console.log(error);
          return [];
        }
      };
      consultarApi();

 

    }
  },[formState.estado])

  return (
    
    <form className="p-8 min-h-[300px] w-[500px] bg-white shadow-md rounded-lg  max-w-[300px] md:max-w-[930px] ">        <h2 className="text-2xl font-bold mb-4 text-center">
          Billing Information
        </h2>

        {/* Flex container for Name and Last Name */}
        <div className="grid grid-cols-1 md:mt-4">
          {/* Name Field */}
          <div className="floating-label-group">
            <input
              type="text"
              id="name"
              value={formState.nombre}
              name="nombre"
              onChange={onInputChange}
              className="h-12 text-[18px] capitalize bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder=" "
            />
            <label htmlFor="nombre" className="block bg-gray-100">
              Name
            </label>
          </div>

          {/* Last Name Field */}
          <div className="floating-label-group">
            <input
              type="text"
              id="lastName"
              value={formState.apellido}
              name="apellido"
              onChange={onInputChange}
              className="h-12 text-[18px] capitalize bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Apellido"
            />
            <label htmlFor="apellido" className="block bg-gray-100">
              Last Name
            </label>
          </div>
        </div>

        {/* Flex container for Email and País */}
        <div className="grid grid-cols-1">
          {/* Email Field */}
          <div className="floating-label-group">
            <input
              type="email"
              id="email"
              value={formState.email}
              name="email"
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder=" "
            />
            <label htmlFor="email" className="block bg-gray-100">
              Email
            </label>
          </div>

          {/* Country Field (País) */}
          <div className="floating-label-group">
            {" "}
            <select 
            name="pais" 
            value={formState.pais} 
            onChange={onInputChange}
            className="h-12 text-gray-400 bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
            id="">
                <option value="">Country</option>
              {
                countries.map((country,id)=>
                  <option value={country} key={id}>{country}</option>
                  )
              }
            </select>
          </div>
        </div>

        {/* Flex container for Provincia and Ciudad */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          {/* State Field (Provincia) */}
          <div className="floating-label-group">
          {" "}
            <select 
            name="estado" 
            value={formState.estado} 
            onChange={onInputChange}
            className="h-12 text-gray-400 bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
            id=""
            disabled={!states.length>0}
            >
                <option value="">State</option>
              {
                states.map((state,id)=>
                  <option value={state} key={id}>{state}</option>
                  )
              }
            </select>
          </div>

          {/* City Field (Ciudad) */}
          <div className="floating-label-group">
            <select 
              name="ciudad" 
              value={formState.ciudad} 
              onChange={onInputChange}
              className="h-12 text-gray-400 bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              id=""
              disabled={!cities.length>0}
              >
                  <option value="">City</option>
                {
                  cities.map((city,id)=>
                    <option value={city} key={id}>{city}</option>
                    )
                }
              </select>
          </div>
        </div>

        {/* Flex container for Dirección and Código Postal */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          {/* Address Field (Dirección) */}
          <div className="floating-label-group">
            <input
              type="text"
              id="address"
              value={formState.line1}
              name="line1"
              onChange={onInputChange}
              className="h-12 text-[18px] capitalize bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder=" "
            />
            <label htmlFor="address" className="block bg-gray-100 ">
              Address
            </label>
          </div>

          {/* Postal Code Field (Código Postal) */}
          <div className="floating-label-group">
            <input
              type="text"
              id="postal_code"
              value={formState.postal_code}
              name="postal_code"
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder=" "
            />
            <label htmlFor="postal_code" className="block bg-gray-100">
            Postal Code
            </label>
          </div>
        </div>
      </form>

  );
};

export default CheckoutForm;
