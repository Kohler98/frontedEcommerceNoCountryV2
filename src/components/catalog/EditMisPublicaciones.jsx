import React, { useState, useEffect, useRef } from "react";
import crudAxios from "../../config/axios";

export default function EditMisPublicaciones({
  isNew,
  isEditing,
  editProduct,
  setEditProduct,
  setIsEditing,
  setIsNew,
  refreshProducts,
}) {
  const referenciaImg = useRef();
  const [files, setFiles] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const consultarApi = async () => {
      try {
        const res = await crudAxios.get("/category");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    consultarApi();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === "category" && e.target.value === "add-new") {
      setIsAddingNewCategory(true);
    } else {
      setIsAddingNewCategory(false);
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName === "add-new") {
      setIsAddingNewCategory(true);
      setEditProduct({ ...editProduct, category: "Añadir nueva categoría" });
    } else {
      setEditProduct({ ...editProduct, category: categoryName });
      setIsAddingNewCategory(false);
    }
    setDropdownOpen(false);
  };

  const handleCategoryDelete = async (e, categoryId) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const {token} = auth;
      const deletedCategoryName = categories.find(
        (category) => category.id === categoryId
      )?.nombre;
      await crudAxios.delete(`/category/${categoryId}`, {
        headers: { "x-token": token },
      });
      // Update categories without causing parent re-render
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      setCategories(updatedCategories);

      // Reset dropdown if the deleted category was selected
      if (editProduct.category === deletedCategoryName) {
        setEditProduct({ ...editProduct, category: "" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const leerImagen = (e) => {
    let file = e.target.files[0];
    setFiles(file);

    // Preview image
    let reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if adding a new category and newCategory is empty
    if (isAddingNewCategory && !newCategory.trim()) {
      alert("Por favor, ingrese el nombre de la nueva categoría.");
      return;
    }

    // Check if an existing category is selected
    if (
      !isAddingNewCategory &&
      (!editProduct.category ||
        editProduct.category === "Seleccione una categoría")
    ) {
      alert("Por favor, seleccione una categoría válida.");
      return;
    }

    const { updatedAt, createdAt, id, activo, ...resto } = editProduct;

    try {
      const {token} = auth;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-token": token,
        },
      };

      let formData = new FormData();
      formData.append("titulo", resto.titulo);
      formData.append("precio", resto.precio);
      formData.append("imagen", files);
      formData.append("marca", resto.marca);
      formData.append("envio", resto.envio);
      formData.append("porcentaje", resto.porcentaje);
      formData.append("descripcion", resto.descripcion);

      if (isAddingNewCategory && newCategory) {
        // Add logic to create a new category
        const categoryConfig = {
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        };
        await crudAxios.post(
          "/category/crear",
          { nombre: newCategory },
          categoryConfig
        );
        // Update categories in state
        setCategories([...categories, { nombre: newCategory }]);
        formData.append("category", newCategory);
      } else {
        formData.append("category", resto.category);
      }

      if (isNew) {
        await crudAxios.post("/product/crear", formData, config);
      } else if (isEditing) {
        await crudAxios.put(`/product/${id}`, formData, config);
      }

      await refreshProducts();
      setIsEditing(false);
      setIsNew(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error updating/adding product:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[550px] md:w-[1000px]"
    >
      <div className="mb-4">
        <h1>Products</h1>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="titulo"
          placeholder="Title"
          value={editProduct.titulo}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <h1>Price</h1>
        <input
          type="number" // Set the input type to "number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="precio"
          placeholder="Price"
          value={editProduct.precio}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <h1>Brand</h1>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="marca"
          placeholder="Brand"
          value={editProduct.marca}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <h1>Discount</h1>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="porcentaje"
          placeholder="Discount"
          value={editProduct.porcentaje}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <h1>Shipping</h1>
        <select
          className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="envio"
          onChange={handleInputChange}
          value={editProduct.envio}
        >
          <option value={true}>Envío Gratis</option>
          <option value={false}>Sin Envío Incluido</option>
        </select>
      </div>

      <div className="mb-4 relative">
        <h1>Categories</h1>
        <button
          type="button"
          className="text-start capitalize bg-white shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onClick={toggleDropdown}
        >
          {editProduct.category || "Seleccione una categoría"}
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 bg-white border rounded w-full py-2 mt-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center px-3 py-1 hover:bg-gray-100 cursor-pointer capitalize"
                onClick={() => handleCategorySelect(category.nombre)}
              >
                <span>{category.nombre}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryDelete(e, category.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
            <hr className="my-1" /> {/* Horizontal line as a separator */}
            <div
              className="px-3 py-1 font-bold hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCategorySelect("add-new")}
            >
              <span>Add Category</span>
            </div>
          </div>
        )}
        {isAddingNewCategory && (
          <input
            type="text"
            placeholder="Nombre de la nueva categoría"
            value={newCategory}
            onChange={handleNewCategoryChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
          />
        )}
      </div>

      <div className="mb-4">
        <h1>Description</h1>
        <textarea
          className="shadow appearance-none border rounded w-full py-20 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
          name="descripcion"
          placeholder="Descripción"
          value={editProduct.descripcion}
          onChange={handleInputChange}
          style={{ paddingTop: "0.5rem" }}
          required
        />
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => referenciaImg.current.click()}
          className=" border border-gray-400 hover:border-gray-500  px-2 rounded"
        >
          Select Image
        </button>
        <input
          type="file"
          name="imagen"
          onChange={leerImagen}
          ref={referenciaImg}
          style={{ display: "none" }}
        />
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              marginTop: "10px",
            }}
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-between space-y-2">
        <button
          className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isNew ? "Add Product" : "Save Changes"}
        </button>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            setIsEditing(false);
            setIsNew(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
