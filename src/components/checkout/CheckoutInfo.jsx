import React, { useContext } from 'react';
import { CartContext } from './../context/CartContext';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import crudAxios from '../../config/axios';
import { CRMContext } from '../context/CRMcontext';
 

const CheckoutInfo = ({formulario}) => {
  const { cartItems } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [formState,setState] = formulario
  const [auth, setAuth] = useContext(CRMContext);
  const total = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
  const productos = cartItems.map((item)=>{
    return{
      titulo:item.titulo,
      precio:item.precio,
      imagen:item.imagen,
      cantidad:item.quantity,
      marca:item.marca
    }
  })
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {

      return;
    }
    


    const returnUrl = `${window.location.origin}/success`;
    try {
      const {token} = auth
      const config = {
        headers: { "x-token": token },
      };
      setState({...formState,productos})

      const res = await crudAxios.post("/order/crear", formState,config);
      if(!res.data.error){
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: returnUrl,
            payment_method_data: {
              billing_details: {
                name: `${formState.nombre} ${formState.apellido}`,
                email: formState.email,
                address: {
                  line1: formState.line1,
                  city: formState.ciudad,
                  state: formState.estado,
                  country: formState.pais,
                  postal_code: formState.postal_code,
                },
                phone: formState.phone,
              },
            },
          },
        });
    
        if (result.error) {
          console.log(result.error.message);
        }

      }
 
      
    } catch (error) {
      console.log(error)
    }
   

  };

  return (
    <div className="p-8 min-h-[300px] w-[500px] lg:w-[1015px] bg-white shadow-md rounded-lg  max-w-[300px] md:max-w-[1015px] ">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Purchase</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
             src={`${import.meta.env.VITE_APP_BACKEND_URL}/uploads/productos/${item.imagen}`}
              // src={`/images/products/${item.titulo}.png`}
              alt={item.titulo}
              className="h-10 w-10 object-cover rounded mr-2"
            />
            <div>
              <h2 className="text-lg font-semibold">{item.titulo}</h2>
              <p className="text-gray-500">${item.precio.toFixed(2)}</p>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
          </div>
         
        </div>
      ))}

      <div className="mb-6 text-xl font-bold text-gray-800 flex justify-between items-center">
        <p>Total:</p>
        <p>${total.toFixed(2)}</p>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!stripe}
        className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Pay
      </button>


    </div>
  );
};

export default CheckoutInfo;
