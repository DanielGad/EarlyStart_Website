import React from "react";
import "../assets/styles/Modal.css";

interface CustomModalProps {
  showModal: boolean;
  title: string; // New title property
  message: string;
  buttonLabel: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const Modal: React.FC<CustomModalProps> = ({ showModal, title, message, buttonLabel, onClose, onConfirm }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">{title}</h3> {/* Added title rendering */}
        <p className="modal-message">{message}</p>
        <div className="button-control">
        {onConfirm && (
            <button onClick={onConfirm} className="confirm-button">
              Confirm
            </button>
          )}
        <button className="modal-button" onClick={onClose}>
          {buttonLabel}
        </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
