import React, { useContext, useEffect, useState } from "react";
import crudAxios from "../../config/axios";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { CRMContext } from "../context/CRMcontext";

const MisCompras = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useContext(CRMContext);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };
      const res = await crudAxios.get("/order/", config);
      setPedidos(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar pedido.",
      cancelButtonText: "No, mantener pedido.",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(id);
      }
    });
  };

  const deleteOrder = async (id) => {
    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };
      await crudAxios.delete(`/order/${id}`, config);
      cargarPedidos();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const calculateTotalPrice = (pedido) => {
    let totalPrice = 0;
    pedido.productos.forEach((producto) => {
      totalPrice += producto.precio * producto.cantidad;
    });
    return totalPrice;
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-[400px] md:max-w-[800px]">
      {isLoading ? (
        <div className="flex justify-center mt-40">
          <div className="flex justify-center items-center h-full">
            <TailSpin color="#030712" height={50} width={50} />
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Order History</h2>
          {pedidos.length === 0 ? (
            <p className="text-center">No orders registered.</p>
          ) : (
            pedidos.map((pedido, index) => (
              <div
                key={index}
                className="mb-6 bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {new Date(pedido.createdAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={() => handleDelete(pedido.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel order{" "}
                  </button>
                </div>
                {/* Add the shipping status message */}
                <div className="p-4">
                  <p className="text-green-600 font-semibold">
                    {pedido.estadoEnvio === "en_proceso"
                      ? "Shipping in Process."
                      : "Pending Shipment."}
                  </p>
                </div>
                {pedido.productos.map((producto, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-4 border-b last:border-b-0"
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_APP_BACKEND_URL
                      }/uploads/productos/${producto.imagen}`}
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
                <p className="font-bold text-center p-2">
                  Total: ${calculateTotalPrice(pedido)}
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default MisCompras;
