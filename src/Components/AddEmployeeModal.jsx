import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const AddEmployeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    baseSalary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "baseSalary" ? parseFloat(value) || "" : value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.baseSalary || isNaN(formData.baseSalary) || formData.baseSalary < 0) {
      toast.error("Please fill all fields with valid data", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    onSubmit(e, formData);
    setFormData({ username: "", email: "", baseSalary: "" }); // Reset form
  };
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="add-employee-modal-title"
      centered
    >
      <Modal.Header
        style={{
          background: "linear-gradient(135deg, #2575fc, #6a11cb)",
          color: "#fff",
          padding: "1.5rem 2rem",
          borderBottom: "none",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Modal.Title
          id="add-employee-modal-title"
          style={{
            fontWeight: "700",
            fontSize: "1.6rem",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Add Employee
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
            background: "linear-gradient(135deg, #2575fc, #6a11cb)",
            border: "none",
            borderRadius: "30px",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#fff",
          }}
          onClick={handleFormSubmit}
          aria-label="Add Employee"
        >
          Add Employee
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmployeeModal;
