import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/context/CartContext";

const Success = () => {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full pt-10">
      <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-green-600 text-3xl font-semibold text-center mb-8">
          ¡Gracias por tu compra!
        </h2>
        <p className="text-gray-800 text-lg text-center">
          Tu pago ha sido procesado con éxito.
        </p>
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-block bg-gray-950 text-white px-6 py-3 rounded-md hover:bg-gray-900 text-lg font-semibold transition duration-300"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
