import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import "../../assets/styles/BlogModal.css";
import Modal from "../Modal";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postedBy, setPostedBy] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
    buttonLabel: "",
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPostedBy("");
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        postedBy,
        createdAt: Timestamp.fromDate(new Date()),
      });

      setModalProps({
        title: "Success!",
        message: "Blog created successfully!",
        buttonLabel: "Continue",
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error creating blog:", error);
      setModalProps({
        title: "Error",
        message: "An error occurred while creating the blog. Please try again.",
        buttonLabel: "Close",
      });
      setShowModal(true);
    } finally {
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Modal
        showModal={showModal}
        title={modalProps.title}
        message={modalProps.message}
        buttonLabel={modalProps.buttonLabel}
        onClose={handleModalClose}
      />
      <div className="modal-content">
        <button className="close-button" onClick={handleModalClose}>
          X
        </button>
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
          <div className="form-group">
            <label htmlFor="postedBy">Posted By:</label>
            <input
              className="form-input"
              type="text"
              id="postedBy"
              value={postedBy}
              onChange={(e) => setPostedBy(e.target.value)}
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
