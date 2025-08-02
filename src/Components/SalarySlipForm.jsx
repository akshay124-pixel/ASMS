import { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalarySlipForm.css";

const SalarySlipForm = ({
  users,
  onSubmit,
  error,
  selectedUser,
  setSelectedUser,
  attendance,
  setAttendance,
  month,
  setMonth,
  onClose,
  isModalOpen,
}) => {
  const modalRef = useRef(null);
  const bootstrapModalRef = useRef(null);

  const handleFocus = (e) => {
    e.target.style.border = "2px solid #3b82f6";
    e.target.style.boxShadow =
      "0 0 12px rgba(59, 130, 246, 0.4), inset 0 2px 8px rgba(0, 0, 0, 0.05)";
  };

  const handleBlur = (e) => {
    e.target.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    e.target.style.boxShadow = "inset 0 2px 8px rgba(0, 0, 0, 0.05)";
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      if (modalRef.current) {
        bootstrapModalRef.current = new bootstrap.Modal(modalRef.current, {
          backdrop: "static",
          keyboard: true,
        });
      }
    });

    return () => {
      if (bootstrapModalRef.current) {
        bootstrapModalRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (bootstrapModalRef.current) {
      if (isModalOpen) {
        bootstrapModalRef.current.show();
      } else {
        bootstrapModalRef.current.hide();
      }
    }
  }, [isModalOpen]);

  return (
    <div
      className="modal fade"
      id="salarySlipModal"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="salarySlipModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content salary-modal-content">
          <div className="modal-header border-0">
            <h2
              className="modal-title w-100 text-center salary-modal-title"
              id="salarySlipModalLabel"
            >
              Generate Salary Slip
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                fontSize: "1.2rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.filter = "brightness(1.2)";
                e.target.style.transform = "scale(1.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.filter = "brightness(1)";
                e.target.style.transform = "scale(1)";
              }}
              aria-label="Close Form"
            ></button>
          </div>
          <div className="modal-body p-4">
            {error && (
              <div
                className="alert alert-danger"
                style={{
                  background: "rgba(254, 226, 226, 0.95)",
                  borderRadius: "12px",
                  fontWeight: "500",
                  boxShadow: "0 4px 15px rgba(220, 38, 38, 0.2)",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={onSubmit} className="d-flex flex-column gap-4">
              <div>
                <label
                  htmlFor="employeeSelect"
                  className="form-label"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#1e40af",
                    letterSpacing: "0.5px",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Select Employee
                </label>
                <select
                  id="employeeSelect"
                  className="form-select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{
                    padding: "0.9rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.25)",
                    fontSize: "1rem",
                    color: "#1f2937",
                    transition: "all 0.3s ease",
                    fontFamily: "'Roboto', sans-serif",
                    backdropFilter: "blur(6px)",
                    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-label="Select Employee"
                >
                  <option value="" style={{ color: "#6b7280" }}>
                    Select...
                  </option>
                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                      style={{ color: "#1f2937" }}
                    >
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="monthSelect"
                  className="form-label"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#1e40af",
                    letterSpacing: "0.5px",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Month
                </label>
                <select
                  id="monthSelect"
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  style={{
                    padding: "0.9rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.25)",
                    fontSize: "1rem",
                    color: "#1f2937",
                    transition: "all 0.3s ease",
                    fontFamily: "'Roboto', sans-serif",
                    backdropFilter: "blur(6px)",
                    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-label="Select Month"
                >
                  <option value="" style={{ color: "#6b7280" }}>
                    Select...
                  </option>
                  {months.map((monthName) => (
                    <option
                      key={monthName}
                      value={monthName}
                      style={{ color: "#1f2937" }}
                    >
                      {monthName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="attendanceInput"
                  className="form-label"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#1e40af",
                    letterSpacing: "0.5px",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Days Attended
                </label>
                <input
                  id="attendanceInput"
                  type="number"
                  className="form-control salary-input"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  placeholder="Enter days attended"
                  min="0"
                  max="31"
                  style={{
                    padding: "0.9rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.25)",
                    fontSize: "1rem",
                    color: "#1f2937",
                    transition: "all 0.3s ease",
                    fontFamily: "'Roboto', sans-serif",
                    backdropFilter: "blur(6px)",
                    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-label="Days Attended"
                />
              </div>
              <button
                type="submit"
                className="btn salary-generate-btn"
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                  fontFamily: "'Poppins', sans-serif",
                }}
                aria-label="Generate Salary Slip"
              >
                Generate Salary Slip
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipForm;
