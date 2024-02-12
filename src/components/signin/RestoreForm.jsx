import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm/useForm";
import crudAxios from "../../config/axios";

export default function RestoreForm() {
  const { formState, onInputChange } = useForm({
    password: "",
    repetirPassword: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const handleRecuperarContrasena = async (e) => {
    e.preventDefault();

    try {
      const res = await crudAxios.post(`/forgot-password/${id}`, formState);

      console.log(res.data);
      // Mostrar mensaje de éxito o redirigir a una página de éxito

      navigate("/signin");
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      console.log(error);
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
              type="password"
              id="password"
              value={formState.password}
              name="password"
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="password"
            />
            <label htmlFor="password" className="block bg-gray-100">
              New Password
            </label>
          </div>
          <div className="floating-label-group">
            <input
              type="password"
              id="repetirPassword"
              value={formState.repetirPassword}
              name="repetirPassword"
              onChange={onInputChange}
              className="h-12 text-[18px] bg-gray-100 border py-55-rem border-gray-400 text-sm rounded-lg focus:outline-none focus:shadow-outline block w-full p-2.5 placeholder-transparent "
              placeholder="Password"
            />
            <label htmlFor="repetirPassword" className="block bg-gray-100">
              Cofirm New Password
            </label>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="bg-gray-950 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
            >
              Recover Password
            </button>
            <div className="flex items-center space-x-10">
              <Link
                to="/signup"
                className="inline-block align-baseline font-bold text-sm text-gray-950 hover:text-gray-900 whitespace-nowrap"
              >
                I don't have an account.
              </Link>
              <Link
                to="/signin"
                className="text-sm font-semibold text-gray-950 whitespace-nowrap"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </form>
        {/* {errors.length > 0 && (
            <div className="mt-10 absolute">
              {errors.map((err, index) => (
                <p key={index} className="text-red-600 ">
                  {err.msg}
                </p>
              ))}
            </div>
          )} */}
      </div>
    </div>
  );
}
