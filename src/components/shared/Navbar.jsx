import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiSearchLine, RiShoppingCartLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import crudAxios from "../../config/axios";
import { Twirl as Hamburger } from "hamburger-react";
import logoImage from "/assets/logoNav.png";
import { CRMContext } from "../../components/context/CRMcontext";
import { CartContext } from "../../components/context/CartContext";
import CartDropDown from "../../components/shared/CartDropDown"; // Import the CartDropdown component
import { useForm } from "../../hooks/useForm/useForm";

export default function Navbar() {
  const [auth, setAuth] = useContext(CRMContext);
  const { userRole } = auth;
  const [isOpen, setOpen] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showProfileSubmenu, setShowProfileSubmenu] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  //CAMBIOS EN SEARCH
  const { formState, onInputChange } = useForm({
    search: "",
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const { cartItems, clearCart } = useContext(CartContext);
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

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

  const handleLogout = () => {
    setAuth({ token: null, isAuthenticated: false, userRole: "" });
    localStorage.removeItem("x-token");
    navigate("/");
    clearCart();
  };

  useEffect(() => {
    const closeCartDropdown = () => {
      setShowCartDropdown(false);
    };

    // Listen for clicks on the document to close the cart dropdown
    document.addEventListener("click", closeCartDropdown);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", closeCartDropdown);
    };
  }, []);

  //CAMBIOS EN NAVBAR
  const handleSearch = async (e) => {
    e.preventDefault();
    if (formState.search.length < 1) return navigate("/");

    navigate(`/search?termino=${formState.search}`);
  };

  const handleCartClick = (e) => {
    if (!auth.isAuthenticated) {
      navigate("/signin");
    }
  };
  const handleCartClickHamburger = (e) => {
    if (auth.isAuthenticated) {
      navigate("/cart");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="sticky top-0 w-full bg-gray-950 z-50">
      <nav className="max-w-[1200px] md:mx-auto flex flex-col md:flex-row justify-between items-center p-5 mx-5">
        {/* Logo and Mobile Controls */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link
            to="/"
            className="flex w-1/3 md:max-w-[500px] lg:md:max-w-[300px] md:mr-10 md:w-auto md:mb-2 "
          >
            <img src={logoImage} alt="Logo" />
          </Link>

          <div className="md:hidden flex items-center">
            <button
              className="text-white ml-10 mr-4"
              onClick={handleCartClickHamburger}
            >
              <RiShoppingCartLine size={24} aria-label="Shopping Cart" />
              {cartItemCount > 0 && (
                <span className="absolute top-6 right-24 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div onClick={() => setOpen(!isOpen)} className="z-50">
              <Hamburger
                color="white"
                size={20}
                toggled={isOpen}
                toggle={setOpen}
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form
          className="w-full items-center flex mt-4 md:mt-0 "
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search..."
            className="px-6 py-2 text-lg rounded-l border border-r-0 focus:outline-none w-full"
            aria-label="Search"
            name="search"
            value={formState.search}
            onChange={onInputChange}
          />
          <button
            type="submit"
            className="px-4 py-3 border rounded-r bg-white text-gray-700"
            aria-label="Submit Search"
          >
            <RiSearchLine size={20} />
          </button>
        </form>

        <div className="hidden md:flex lg:hidden items-center">
          <button
            className="text-white ml-10 mr-4"
            onClick={handleCartClickHamburger}
          >
            <RiShoppingCartLine size={24} aria-label="Shopping Cart" />
            {cartItemCount > 0 && (
              <span className="absolute top-6 right-24 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <div onClick={() => setOpen(!isOpen)} className="z-50">
            <Hamburger
              color="white"
              size={20}
              toggled={isOpen}
              toggle={setOpen}
            />
          </div>
        </div>

        {/* Desktop Menu and User Controls */}
        <div className="hidden lg:flex  font-semibold text-white mx-10">
          {/* Category Dropdown */}
          <div className="relative group items-center">
            <button className="p-2 flex items-center justify-center gap-2">
              Categories <IoIosArrowDown />
            </button>
            <div className="absolute p-2 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 bg-white rounded text-gray-800 transform transition-all duration-300 ease-in-out flex flex-col font-bold pointer-events-none group-hover:pointer-events-auto">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  onClick={() => setOpen(false)}
                  to={`product/get/${category.slug}`}
                  className="p-2 hover:bg-gray-200 rounded capitalize"
                >
                  {category.nombre}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile and Cart Dropdown */}
          {auth.isAuthenticated ? (
            <>
              <div className="relative group items-center">
                <button className="p-3 flex items-center justify-center gap-2">
                  <FaRegUser /> <IoIosArrowDown />
                </button>
                <div className="absolute p-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 bg-white rounded text-gray-800 transition-all duration-300 ease-in-out flex flex-col font-bold pointer-events-none group-hover:pointer-events-auto">
                  <Link
                    to="/me"
                    className="p-2 hover:bg-gray-200 rounded text-start"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="p-2 hover:bg-gray-200 rounded text-start"
                  >
                    Orders
                  </Link>
                  {userRole === "ADMIN_ROLE" && (
                    <>
                      <Link
                        to="/catalog"
                        className="p-2 hover:bg-gray-200 rounded text-start"
                      >
                        Catalog
                      </Link>
                      <Link
                        to="/users"
                        className="p-2 hover:bg-gray-200 rounded text-start"
                      >
                        Users
                      </Link>
                    </>
                  )}
                  <a
                    href="/"
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-200 rounded text-start cursor-pointer"
                  >
                    Salir
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link className="p-2 mr-2 whitespace-nowrap" to="/signin">
                Login
              </Link>

              <Link
                className="p-2 mr-2 bg-gray-100 rounded text-gray-900 whitespace-nowrap"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}

          <div className={`relative ${auth.isAuthenticated ? "group" : ""}`}>
            <button
              onClick={handleCartClick}
              className="p-2 flex items-center justify-center space-x-2"
            >
              <RiShoppingCartLine size={24} aria-label="Shopping Cart" />
              {auth.isAuthenticated && <IoIosArrowDown />}
              {cartItemCount > 0 && (
                <span className="absolute top-0 left-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div
              className={`absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 ${
                auth.isAuthenticated
                  ? "group-hover:opacity-100 group-hover:scale-100"
                  : ""
              } scale-95 bg-white rounded text-gray-800 transition-all duration-300 ease-in-out flex flex-col font-bold pointer-events-none ${
                auth.isAuthenticated ? "group-hover:pointer-events-auto" : ""
              }`}
            >
              <CartDropDown />
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed top-0 h-screen w-full  bg-black bg-opacity-50 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
        ></div>

        {/* Mobile Menu */}
        <ul
          className={`lg:hidden fixed top-0 right-0 h-screen  px-10 space-y-8 bg-gray-950 flex flex-col pt-32 text-white text-xl transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition duration-300 ease-in-out`}
        >
          {auth.isAuthenticated ? (
            <>
              <div className="relative group items-center">
                <button
                  className="p-2 flex items-center justify-center gap-2"
                  onClick={() => setShowProfileSubmenu(!showProfileSubmenu)}
                >
                  My Account <IoIosArrowDown />
                </button>
                <div
                  className={`${
                    showProfileSubmenu ? "block" : "hidden"
                  } flex flex-col font-bold `}
                >
                  <Link
                    onClick={() => {
                      setOpen(false);
                      setShowProfileSubmenu(false);
                    }}
                    to="/me"
                    className="p-2 my-2 hover:bg-gray-800 rounded"
                  >
                    Profile
                  </Link>

                  <Link
                    onClick={() => {
                      setOpen(false);
                      setShowProfileSubmenu(false);
                    }}
                    to="/orders"
                    className="p-2 my-2 hover:bg-gray-800 rounded"
                  >
                    Orders
                  </Link>

                  {userRole === "ADMIN_ROLE" && (
                    <>
                      <Link
                        onClick={() => {
                          setOpen(false);
                          setShowProfileSubmenu(false);
                        }}
                        to="/catalog"
                        className="p-2 my-2 hover:bg-gray-800 rounded"
                      >
                        Catalog{" "}
                      </Link>

                      <Link
                        onClick={() => {
                          setOpen(false);
                          setShowProfileSubmenu(false);
                        }}
                        to="/users"
                        className="p-2 my-2 hover:bg-gray-800 rounded"
                      >
                        Users
                      </Link>
                    </>
                  )}

                  <a
                    href="/"
                    onClick={() => {
                      handleLogout();
                      setShowProfileSubmenu(false);
                    }}
                    className="p-2  hover:bg-gray-800 rounded"
                  >
                    Salir
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2"
                to="/signin"
              >
                Ingresar
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2"
                to="/signup"
              >
                Registrarse
              </Link>
            </>
          )}

          <div className={`relative group items-center`}>
            <button
              className="p-2 flex items-center justify-center gap-2 "
              onClick={() => setShowSubmenu(!showSubmenu)}
            >
              Categories <IoIosArrowDown />
            </button>
            <div
              className={`${
                showSubmenu ? "block" : "hidden"
              } flex flex-col font-bold`}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  onClick={() => {
                    setOpen(false);
                    setShowSubmenu(false);
                  }}
                  to={`product/get/${category.slug}`}
                  className="p-2 hover:bg-gray-800 rounded capitalize"
                >
                  {category.nombre}
                </Link>
              ))}
            </div>
          </div>
        </ul>
      </nav>
    </div>
  );
}
