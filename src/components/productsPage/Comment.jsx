import React, { useContext, useState } from 'react'
import { CRMContext } from '../context/CRMcontext';
import { useForm } from '../../hooks/useForm/useForm';
import crudAxios from '../../config/axios';

export const Comment = ({comment}) => {
    const [replyTexts, setReplyTexts] = useState({}); // Object to hold reply texts keyed by comment ID
    const [auth] = useContext(CRMContext);
    const { formState, onInputChange, onResetForm, setState } = useForm({
        comentario:''
    });
    const {userRole} = auth
    const {replies,usuario:{id}} = comment
 

    const postReply = async () => {

        const {token} = auth
 
        const config = {
          headers: { "x-token": token },
        };
        const {id} = comment
        if (!formState.comentario.trim()) return;
        try {
          const res = await crudAxios.post(`/comment/reply/${id}`,formState,config);

          console.log(res.data)
        } catch (error) {
          console.error("Error posting reply:", error);
        }
      };
    

  return (
    <>
        <li key={comment.id} className="bg-gray-100 p-3 rounded shadow">
            <p className="text-gray-800">{comment.mensaje}</p>
            {/* Render replies */}
            {replies && replies.length > 0 && (
              <ul className="mt-2 ml-4 pl-4 border-l-2">
                {replies.map((reply) => (
                  <li key={reply.id} className="mt-2">
                    <p className="text-gray-700">{reply.mensaje}</p>
                  </li>
                ))}
              </ul>
            )}
            {/* Reply form */}
            {(auth.isAuthenticated  && id == auth.idUsuario) || userRole == "ADMIN_ROLE" ?(
              <div className="mt-4">
                <textarea
                  value={formState.comentario}
                  name='comentario'
                  onChange={onInputChange }
                  placeholder="Write your reply here..."
                  className="w-full p-2 border rounded focus:outline-none"
                ></textarea>
                <button
                  onClick={ postReply}
                  className="mt-2 px-4 py-2 bg-gray-950 hover:bg-gray-900 text-white rounded focus:outline-none"
                >
                  Post Reply
                </button>
              </div>
            ):''}
          </li>
    </>
  )
}
