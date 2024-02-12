import { CRMContext } from "../context/CRMcontext"; // Adjust path as necessary
import React, { useState, useEffect, useContext } from "react";
import crudAxios from "../../config/axios";
import { Comment } from "./Comment";

const CommentsSection = ({ producto }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  const [auth] = useContext(CRMContext);
  const {comentarios} = producto


  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const {token} = auth
 
      const config = {
        headers: { "x-token": token },
      };
      const {id} = producto

 
      const comentario = { comentario: newComment }
      await crudAxios.post( `/comment/${id}`,comentario,config);
      setNewComment("");

    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-4">
      <h3 className="text-xl font-semibold border-b pb-2">Comments</h3>
      {auth.isAuthenticated && (
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-2 border rounded focus:outline-none"
          ></textarea>
          <button
            onClick={postComment}
            className="mt-2 px-4 py-2 bg-gray-950 hover:bg-gray-900 text-white rounded focus:outline-none "
          >
            Post Comment
          </button>
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {comentarios.map((comment, i) => (
          <Comment key={i} comment={comment}/>
        ))}
      </ul>
    </div>
  );
};

export default CommentsSection;
