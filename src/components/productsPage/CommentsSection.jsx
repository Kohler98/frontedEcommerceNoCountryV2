import { CRMContext } from "../context/CRMcontext";
import React, { useState, useEffect, useContext } from "react";
import crudAxios from "../../config/axios";
import { Comment } from "./Comment";

const CommentsSection = ({ producto, onRefreshProduct }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [auth] = useContext(CRMContext);
  const { comentarios } = producto;

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { token } = auth;

      const config = {
        headers: { "x-token": token },
      };
      const { id } = producto;

      const comentario = { comentario: newComment };
      await crudAxios.post(`/comment/${id}`, comentario, config);
      setNewComment("");
      onRefreshProduct(); // Refresh the product data after posting a comment
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mx-auto p-4 w-full md:w-3/4">
      <h3 className="text-xl font-semibold border-b pb-2">Comments</h3>
      {auth.isAuthenticated && (
        <div className="mt-4 flex flex-col md:flex-row">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full md:flex-1 px-2 py-1 border rounded focus:outline-none resize-none h-10"
          ></textarea>
          <button
            onClick={postComment}
            className="mt-2 md:mt-0 md:ml-4 px-5 py-2 bg-gray-950 hover:bg-gray-900 text-white rounded focus:outline-none transition-colors"
          >
            Post
          </button>
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {producto.comentarios &&
          producto.comentarios.map((comment, i) => (
            <Comment
              key={i}
              comment={comment}
              onRefreshProduct={onRefreshProduct}
            />
          ))}
      </ul>
    </div>
  );
};

export default CommentsSection;
