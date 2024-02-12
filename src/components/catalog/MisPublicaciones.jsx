import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import crudAxios from "../../config/axios";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line, RiDeleteBin7Fill } from "react-icons/ri";
import EditMisPublicaciones from "./EditMisPublicaciones";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { CRMContext } from "../context/CRMcontext";

export default function MisPublicaciones() {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  const [ids, setIds] = useState("");
  const [auth, setAuth] = useContext(CRMContext);
  const referenciaExcel = useRef();
  const referenciasImg = useRef();

  const leerImagen = async (e) => {
    const formData = new FormData();
    formData.append("imagen", e.target.files[0]);

    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };

      const res = await crudAxios.post(`product/img/${ids}`, formData, config);
      console.log(res.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleUploadInventory = async (e) => {
    const formData = new FormData();
    formData.append("excel", e.target.files[0]);

    try {
      const { token } = auth;
      const config = {
        headers: { "x-token": token },
      };

      const res = await crudAxios.post(`invoice/crear`, formData, config);

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectedId = async (id) => {
    setIds(id);
    referenciasImg.current.click();
  };
  const handleDownloadInventory = async () => {
    try {
      const { token } = auth;

      const headers = { "x-token": token, "Content-Type": "blob" };

      const config = { method: "GET", responseType: "blob", headers };
      const res = await crudAxios.get(`/invoice/`, config);
      const blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "total_inventario.xlsx";
      link.click();
    } catch (error) {
      console.error("Error downloading excel:", error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await crudAxios.get("/product");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setIsNew(true);
    setIsEditing(false);
    setEditProduct({
      titulo: "",
      precio: "",
      category: "",
      marca: "",
      envio: true,
      porcentaje: 0,
      descripcion: "",
      imagen: "",
    });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProduct(product);
  };

  const handleRemove = async (productId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar producto.",
      cancelButtonText: "No, mantener producto.",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { token } = auth;
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-token": token,
            },
          };
          await crudAxios.delete(`/product/${productId}`, config);
          refreshProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    });
  };

  const refreshProducts = async () => {
    const res = await crudAxios.get("/product");
    setProducts(res.data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-40">
        <div className="flex justify-center items-center h-full">
          <TailSpin
            color="#030712" // Choose color
            height={50} // Set height
            width={50} // Set width
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container flex justify-center mx-auto p-4 max-w-[400px] md:max-w-[600px] lg:max-w-[800px] pt-10">
      {isNew || isEditing ? (
        <EditMisPublicaciones
          isNew={isNew}
          isEditing={isEditing}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          setIsEditing={setIsEditing}
          setIsNew={setIsNew}
          refreshProducts={refreshProducts}
        />
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-2xl font-bold mb-2 md:mb-0">Products List</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddNew}
                className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-lg mt-2 md:mt-0"
              >
                Upload Product
              </button>
              <input
                type="file"
                name="excel"
                onChange={handleUploadInventory}
                style={{ display: "none" }}
                ref={referenciaExcel}
              />
              <button
                onClick={() => referenciaExcel.current.click()}
                className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-lg mt-2 md:mt-0"
              >
                Upload Product By Excel
              </button>

              <button
                onClick={handleDownloadInventory}
                className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-lg mt-2 md:mt-0"
              >
                Download Inventory
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded p-8 mb-4 md:max-w-[800px]">
            <ul>
              <input
                type="file"
                name="imagen"
                style={{ display: "none" }}
                ref={referenciasImg}
                onChange={(e) => leerImagen(e)}
              />
              {products.map((product, index) => {
                return (
                  <li key={product.id} className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="flex items-center gap-10">
                        <img
                          className="w-20 h-20 object-cover rounded"
                          src={
                            product.imagen
                              ? `${
                                  import.meta.env.VITE_APP_BACKEND_URL
                                }/uploads/productos/${product.imagen}`
                              : "/images/products/error.png"
                          }
                          alt={product.titulo}
                          onClick={() => handleSelectedId(product.id)}
                        />
                        <Link
                          to={`/product/${product.id}`}
                          className="flex items-center space-x-2"
                        >
                          <div>
                            <h3 className="text-lg font-bold ">
                              {product.titulo}
                            </h3>
                            <p className="text-gray-600">${product.precio}</p>
                          </div>
                        </Link>
                      </div>

                      <div className="flex items-center space-x-2 text-blue-800 mt-4 md:mt-0">
                        <button onClick={() => handleEdit(product)}>
                          <FaRegEdit />
                        </button>

                        <button
                          className="text-red-500"
                          onClick={() => handleRemove(product.id)}
                          onMouseEnter={() => setHoveredItemId(product.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                        >
                          {hoveredItemId === product.id ? (
                            <RiDeleteBin7Fill />
                          ) : (
                            <RiDeleteBin7Line />
                          )}
                        </button>
                      </div>
                    </div>
                    {index < products.length - 1 && (
                      <hr className="my-4 border-gray-300" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
