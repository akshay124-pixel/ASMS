import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const EditEmployeeModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    baseSalary: initialData?.baseSalary || "",
  });

  // Sync form state whenever initialData changes
  useEffect(() => {
    setFormData({
      username: initialData?.username || "",
      email: initialData?.email || "",
      baseSalary: initialData?.baseSalary || "",
    });
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.baseSalary) {
      toast.error("All fields (username, email, base salary) are required", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    onSubmit(e, formData);
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="edit-employee-modal-title"
      centered
    >
      <Modal.Header
        style={{
          background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
          color: "#fff",
          padding: "1.5rem 2rem",
          borderBottom: "none",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Modal.Title
          id="edit-employee-modal-title"
          style={{
            fontWeight: "700",
            fontSize: "1.6rem",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Edit Employee
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "2rem",
          background: "#f9fafb",
          borderRadius: "0 0 12px 12px",
          minHeight: "300px",
          boxShadow: "inset 0 -4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Form onSubmit={handleFormSubmit}>
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 240, 245, 0.98))",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                padding: "1rem 0",
              }}
            >
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                  }}
                >
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter name"
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                  }}
                >
                  Base Salary (₹)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  placeholder="Enter base salary"
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          style={{
            borderRadius: "30px",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Cancel
        </Button>
        <Button
          style={{
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            border: "none",
            borderRadius: "30px",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#fff",
          }}
          onClick={handleFormSubmit}
          aria-label="Save Changes"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEmployeeModal;
