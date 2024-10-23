import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure correct firebase import
import '../../assets/styles/BlogModal.css'

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Handle form submission to create a blog post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Add a new blog post to the Firestore collection "blogs"
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        createdAt: Timestamp.fromDate(new Date()),
      });

      alert("Blog created successfully!");
      onClose(); // Close the modal after successful blog creation
    } catch (error) {
      console.error("Error creating blog:", error);
      setError("Error creating blog, please try again.");
    }
  };

  if (!isOpen) {
    return null; // Don't render anything if modal is not open
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className="modal-title">Create a New Blog Post</h2>
        <form className="blog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              className="form-input"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              className="form-textarea"
              id="content"
              value={content}
              rows={5}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="submit-button" type="submit">Create Blog</button>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
