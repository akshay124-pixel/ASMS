import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalarySlipForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  success,
  resetSuccess, // New prop to reset success state
}) => {
  const modalRef = useRef(null);
  const bootstrapModalRef = useRef(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [formData, setFormData] = useState({
    incomeTax: "",
    houseRentAllowance: "",
    transportAllowance: "",
    medicalAllowance: "",
    othersEarnings: "",
    bonus: "",
    ot: "",
    providentFund: "",
    esi: "",
    professionalTax: "",
    othersDeductions: "",
    advance: "",
  });

  // Reset form completely on successful submission
  useEffect(() => {
    if (success) {
      // Reset formData
      setFormData({
        incomeTax: "",
        houseRentAllowance: "",
        transportAllowance: "",
        medicalAllowance: "",
        othersEarnings: "",
        bonus: "",
        ot: "",
        providentFund: "",
        esi: "",
        professionalTax: "",
        othersDeductions: "",
        advance: "",
      });
      // Reset main form fields
      setSelectedUser("");
      setMonth("");
      setAttendance("");
      // Collapse More Details section
      setShowMoreDetails(false);
      // Reset success state in parent after form reset
      resetSuccess();
    }
  }, [success, setSelectedUser, setMonth, setAttendance, resetSuccess]);

  const handleFocus = (e) => {
    e.target.style.border = "2px solid #3b82f6";
    e.target.style.boxShadow =
      "0 0 12px rgba(59, 130, 246, 0.4), inset 0 2px 8px rgba(0, 0, 0, 0.05)";
  };

  const handleBlur = (e) => {
    e.target.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    e.target.style.boxShadow = "inset 0 2px 8px rgba(0, 0, 0, 0.05)";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value && Number(value) < 0) {
      toast.error(
        `${name.replace(/([A-Z])/g, " $1").trim()} cannot be negative`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      userId: selectedUser,
      month,
      daysWorked: attendance,
      ...formData,
    };
    onSubmit(submissionData);
  };

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
    <>
      <ToastContainer />
      <div
        className="modal fade"
        id="salarySlipModal"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="salarySlipModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
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
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-4"
              >
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
                    required
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
                    required
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
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setShowMoreDetails(!showMoreDetails)}
                  style={{
                    padding: "0.7rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                  aria-expanded={showMoreDetails}
                  aria-controls="moreDetailsCollapse"
                >
                  {showMoreDetails ? "Hide Details" : "More Details"}
                </button>
                <div
                  className={`collapse ${showMoreDetails ? "show" : ""}`}
                  id="moreDetailsCollapse"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <h5
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          color: "#1e40af",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Additional Earnings
                      </h5>
                      {[
                        {
                          label: "House Rent Allowance",
                          name: "houseRentAllowance",
                        },
                        {
                          label: "Transport Allowance",
                          name: "transportAllowance",
                        },
                        {
                          label: "Medical Allowance",
                          name: "medicalAllowance",
                        },
                        { label: "Others", name: "othersEarnings" },
                        { label: "Bonus", name: "bonus" },
                        { label: "OT", name: "ot" },
                      ].map((field) => (
                        <div key={field.name} className="mb-3">
                          <label
                            htmlFor={field.name}
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              color: "#1e40af",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            {field.label}
                          </label>
                          <input
                            id={field.name}
                            type="number"
                            name={field.name}
                            className="form-control"
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={`Enter ${field.label} (optional)`}
                            step="0.01"
                            style={{
                              padding: "0.7rem",
                              borderRadius: "8px",
                              border: "1px solid rgba(0, 0, 0, 0.1)",
                              background: "rgba(255, 255, 255, 0.25)",
                              fontSize: "0.9rem",
                              color: "#1f2937",
                              transition: "all 0.3s ease",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            aria-label={field.label}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="col-md-6">
                      <h5
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          color: "#1e40af",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Deductions
                      </h5>
                      {[
                        { label: "Income Tax", name: "incomeTax" },
                        { label: "Provident Fund", name: "providentFund" },
                        { label: "ESI", name: "esi" },
                        { label: "Professional Tax", name: "professionalTax" },
                        { label: "Others", name: "othersDeductions" },
                        { label: "Advance", name: "advance" },
                      ].map((field) => (
                        <div key={field.name} className="mb-3">
                          <label
                            htmlFor={field.name}
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              color: "#1e40af",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            {field.label}
                          </label>
                          <input
                            id={field.name}
                            type="number"
                            name={field.name}
                            className="form-control"
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={`Enter ${field.label} (optional)`}
                            step="0.01"
                            style={{
                              padding: "0.7rem",
                              borderRadius: "8px",
                              border: "1px solid rgba(0, 0, 0, 0.1)",
                              background: "rgba(255, 255, 255, 0.25)",
                              fontSize: "0.9rem",
                              color: "#1f2937",
                              transition: "all 0.3s ease",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            aria-label={field.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
    </>
  );
};

export default SalarySlipForm;
