import { Modal, Button } from "react-bootstrap";

const ViewEmployeeModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="view-employee-modal-title"
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
          id="view-employee-modal-title"
          style={{
            fontWeight: "700",
            fontSize: "1.6rem",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Employee Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "2rem",
          background: "#f9fafb",
          borderRadius: "0 0 12px 12px",
          minHeight: "400px",
          boxShadow: "inset 0 -4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
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
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Name
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.username || "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Employee ID
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.employeeid || "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Email
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.email || "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Base Salary (₹)
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.baseSalary ? `₹${user.baseSalary.toFixed(2)}` : "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Join Date
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.joindate
                  ? new Date(user.joindate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                PAN
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.pan || "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Aadhaar
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.adhaar || "N/A"}
              </p>
            </div>
            <div>
              <strong
                style={{
                  color: "#2575fc",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Designation
              </strong>
              <p style={{ color: "#444", fontSize: "1rem" }}>
                {user.deg || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
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
          onClick={onClose}
          aria-label="Close Modal"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewEmployeeModal;
