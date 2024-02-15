import React, { useContext, useState } from "react";
import { CRMContext } from "../context/CRMcontext";
import { useForm } from "../../hooks/useForm/useForm";
import crudAxios from "../../config/axios";
import { HiChatAlt } from "react-icons/hi";
import { FaUser } from "react-icons/fa";

export const Comment = ({ comment, onRefreshProduct }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [auth] = useContext(CRMContext);
  const { formState, onInputChange } = useForm({ comentario: "" });
  const { userRole } = auth;
  const { replies, usuario } = comment;

  const postReply = async () => {
    const { token } = auth;
    const config = { headers: { "x-token": token } };
    if (!formState.comentario.trim()) return;
    try {
      await crudAxios.post(`/comment/reply/${comment.id}`, formState, config);

      setShowReplyForm(false);
      onInputChange({ target: { name: "comentario", value: "" } });
      onRefreshProduct();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };
  console.log(userRole);

  return (
    <li className="bg-white p-4 rounded-md shadow mb-2 border border-gray-200">
      <div className="flex items-start space-x-3 mb-2">
        {/* User image */}
        <div className="shrink-0">
          {usuario.imagen ? (
            <img
              className="h-10 w-10 rounded-full"
              src={`${import.meta.env.VITE_APP_BACKEND_URL}/uploads/users/${
                usuario.imagen
              }`}
              alt="User profile"
            />
          ) : (
            <FaUser className="h-10 w-10 rounded-full bg-gray-200 text-gray-400 p-2" />
          )}
        </div>
        {/* Comment content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-900">
              {usuario.nombre} {usuario.apellido}
            </h5>
            {
              //(auth.isAuthenticated && usuario.id == auth.idUsuario) ||
              userRole === "ADMIN_ROLE" && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                >
                  <HiChatAlt className="text-lg" /> Reply
                </button>
              )
            }
          </div>
          <p className="text-gray-700 mt-1">{comment.mensaje}</p>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-4 ml-14">
          <textarea
            value={formState.comentario}
            name="comentario"
            onChange={onInputChange}
            placeholder="Write your reply here..."
            className="w-full p-2 border border-gray-300 rounded transition duration-150 ease-in-out"
          ></textarea>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowReplyForm(false)}
              className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300  rounded focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={postReply}
              className="mt-2 px-4 py-2 bg-gray-950 hover:bg-gray-900 text-white rounded focus:outline-none"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div className="mt-4 ml-14 border-l-2 border-gray-200 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="mt-2">
              <div className="flex items-start space-x-3">
                <div className="shrink-0">
                  {reply.usuario.imagen ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`${
                        import.meta.env.VITE_APP_BACKEND_URL
                      }/uploads/users/${reply.usuario.imagen}`}
                      alt="User profile"
                    />
                  ) : (
                    <FaUser className="h-8 w-8 rounded-full bg-gray-200 text-gray-400 p-1.5" />
                  )}
                </div>
                <div>
                  <div className="flex gap-2">
                    {" "}
                    {/* <h1 className="font-medium text-gray-900">
                      {reply.usuario.nombre} {reply.usuario.apellido}
                    </h1> */}
                    <h1 className="font-bold border rounded px-2 text-sm">
                      ADMIN
                    </h1>
                  </div>

                  <p className="text-gray-700 mt-1">{reply.mensaje}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </li>
  );
};
