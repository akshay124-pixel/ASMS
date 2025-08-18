import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userId }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmationText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(userId);
    } catch (err) {
      // Error is handled in the parent component (EmployeeDashboard)
    } finally {
      setIsLoading(false);
      setConfirmationText("");
      onClose();
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        setConfirmationText("");
        setIsLoading(false);
        onClose();
      }}
      backdrop="static"
      keyboard={false}
      aria-labelledby="delete-confirmation-modal-title"
      centered
    >
      <Modal.Header
        style={{
          background: "linear-gradient(135deg, #2575fc, #6a11cb)",
          color: "#fff",
          padding: "1.5rem 2rem",
          borderBottom: "none",
        }}
      >
        <Modal.Title id="delete-confirmation-modal-title">
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </p>
        <p>
          Type <strong>DELETE</strong> below to confirm:
        </p>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Type DELETE"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setConfirmationText("");
            setIsLoading(false);
            onClose();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={isLoading || confirmationText !== "DELETE"}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
