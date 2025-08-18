import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaPlus, FaFileExcel, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import ViewEmployeeModal from "./ViewEmployeeModal.jsx";
import AddEmployeeModal from "./AddEmployeeModal.jsx";
import EditEmployeeModal from "./EditEmployeeModal.jsx";
import DeleteConfirmationModal from "./DeleteConfirmationModal.jsx";
import * as XLSX from "xlsx";
import "../App.css";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const token = localStorage.getItem("token");
  const LoadingSpinner = () => (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #e0e7ff, #c3dafe)",
      }}
    >
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="mt-3"
          style={{
            fontSize: "1.2rem",
            color: "#4b5563",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
  // Fetch employees from backend
  const fetchUsers = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/employees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employees");
      }

      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch employees");
      setLoading(false);
      toast.error(err.message || "Failed to fetch employees", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleAddEmployee = () => {
    setAddModalOpen(true);
  };

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (userId) => {
    try {
      if (!userId) {
        throw new Error("No user ID provided for deletion");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/delete-employees/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete employee");
      }

      // Refetch users to ensure state is synchronized with backend
      await fetchUsers();
      toast.success("Employee deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      console.error("Delete error:", err.message, err.stack);
      toast.error(err.message || "Failed to delete employee", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setDeleteModalOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEmployeeSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      const {
        username,
        email,
        baseSalary,
        employeeid,
        joindate,
        pan,
        adhaar,
        deg,
      } = formData;
      if (!username || !email || !baseSalary || !employeeid) {
        throw new Error(
          "Username, email, base salary, and employee ID are required"
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format");
      }
      if (isNaN(baseSalary) || baseSalary <= 0) {
        throw new Error("Base salary must be a positive number");
      }
      if (joindate && isNaN(Date.parse(joindate))) {
        throw new Error("Invalid join date format");
      }

      const url = editingUser
        ? `${import.meta.env.VITE_API_URL}/api/edit-employees/${
            editingUser._id
          }`
        : `${import.meta.env.VITE_API_URL}/api/add-employees`;
      const method = editingUser ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          baseSalary: parseFloat(baseSalary),
          employeeid,
          joindate,
          pan,
          adhaar,
          deg,
        }),
      });
      const result = await response.json();
      if (response.ok && result.data) {
        // Refetch employees to ensure state is synchronized with backend
        await fetchUsers();
        toast.success(
          editingUser
            ? "Employee updated successfully"
            : "Employee added successfully",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        setEditModalOpen(false);
        setAddModalOpen(false);
        setEditingUser(null);
      } else {
        throw new Error(result.error || "Failed to save employee");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Server error", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      if (users.length === 0) {
        toast.warn("No employees to export", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        return;
      }

      const exportData = users.map((user) => ({
        Name: user.username || "N/A",
        Email: user.email || "N/A",
        "Employee ID": user.employeeid || "N/A",
        "Base Salary (₹)": user.baseSalary || 0,
        "Join Date": user.joindate
          ? new Date(user.joindate).toLocaleDateString()
          : "N/A",
        PAN: user.pan || "N/A",
        Aadhaar: user.adhaar || "N/A",
        Designation: user.deg || "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employees");

      ws["!cols"] = [
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
      ];

      XLSX.writeFile(wb, "Employees.xlsx");
      toast.success("Employees exported to Excel successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export to Excel: " + err.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #e0e7ff, #c3dafe)",
        }}
      >
        <div
          style={{
            color: "#dc2626",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            padding: "1.5rem",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1.1rem",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem",
          gap: "1rem",
        }}
      >
        <Link to="/accounts">
          <button
            style={{
              padding: "0.9rem 2rem",
              background: "linear-gradient(90deg, #2563eb, #6d28d9)",
              color: "#ffffff",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseOver={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #1d4ed8, #5b21b6)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #2563eb, #6d28d9)")
            }
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            aria-label="Back to Accounts"
          >
            <FaArrowLeft /> Back
          </button>
        </Link>
        <button
          className="action-button btn-add"
          onClick={handleAddEmployee}
          style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(90deg, #2563eb, #6d28d9)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #1d4ed8, #5b21b6)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #2563eb, #6d28d9)")
          }
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="Add New Employee"
        >
          <FaPlus /> Add Employee
        </button>
        <button
          onClick={handleExportExcel}
          style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(90deg, #2563eb, #6d28d9)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #1d4ed8, #5b21b6)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #2563eb, #6d28d9)")
          }
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="Export to Excel"
        >
          <FaFileExcel /> Export to Excel
        </button>
      </div>
      <AddEmployeeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
      />
      <EditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEmployeeSubmit}
        initialData={editingUser}
      />
      <ViewEmployeeModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={selectedUser}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        userId={userIdToDelete}
      />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(15px)",
          borderRadius: "24px",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
          padding: "0rem",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.2)",
          }}
          className="custom-scrollbar"
        >
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.2);
              borderradius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.5);
              borderradius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.8);
            }
          `}</style>
          <table
            style={{
              width: "100%",
              maxWidth: "100%",
              borderCollapse: "separate",
              borderSpacing: "0",
              fontSize: "1rem",
              fontFamily: "'Roboto', sans-serif",
              color: "#1f2937",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "linear-gradient(90deg, #2563eb, #6d28d9)",
                zIndex: 1,
              }}
            >
              <tr
                style={{
                  color: "#ffffff",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  letterSpacing: "1.2px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <th
                  style={{
                    padding: "1.4rem 2rem",
                    textAlign: "left",
                    borderTopLeftRadius: "12px",
                    width: "25%",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "1.4rem 2rem",
                    textAlign: "left",
                    width: "25%",
                  }}
                >
                  Employee ID
                </th>
                <th
                  style={{
                    padding: "1.4rem 2rem",
                    textAlign: "left",
                    width: "25%",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "1.4rem 2rem",
                    textAlign: "left",
                    width: "15%",
                  }}
                >
                  Salary (₹)
                </th>
                <th
                  style={{
                    padding: "1.4rem 2rem",
                    textAlign: "left",
                    borderTopRightRadius: "12px",
                    width: "10%",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#6b7280",
                      fontStyle: "italic",
                      background: "rgba(243, 244, 246, 0.9)",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1rem",
                      borderRadius: "12px",
                      boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    No employees available
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    style={{
                      background:
                        index % 2 === 0
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(224, 242, 254, 0.2)",
                      borderBottom:
                        index < users.length - 1
                          ? "1px solid rgba(0, 0, 0, 0.08)"
                          : "none",
                      transition: "all 0.3s ease-in-out",
                      transform: "translateY(0)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59, 130, 246, 0.15)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(224, 242, 254, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <td
                      style={{
                        padding: "1.4rem 2rem",
                        color: "#1f2937",
                        fontWeight: "500",
                      }}
                    >
                      {user.username}
                    </td>
                    <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                      {user.employeeid}
                    </td>
                    <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                      ₹{user.baseSalary}
                    </td>
                    <td
                      style={{
                        padding: "1.4rem 2rem",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleView(user)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaEye />
                      </Button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="editBtn"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg height="1em" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </button>
                      <button
                        className="bin-button"
                        onClick={() => handleDelete(user._id)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          className="bin-top"
                          viewBox="0 0 39 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            y1="5"
                            x2="39"
                            y2="5"
                            stroke="white"
                            strokeWidth="4"
                          ></line>
                          <line
                            x1="12"
                            y1="1.5"
                            x2="26.0357"
                            y2="1.5"
                            stroke="white"
                            strokeWidth="3"
                          ></line>
                        </svg>
                        <svg
                          className="bin-bottom"
                          viewBox="0 0 33 39"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask id="path-1-inside-1_8_19" fill="white">
                            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                          </mask>
                          <path
                            d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                            fill="white"
                            mask="url(#path-1-inside-1_8_19)"
                          ></path>
                          <path
                            d="M12 6L12 29"
                            stroke="white"
                            strokeWidth="4"
                          ></path>
                          <path
                            d="M21 6V29"
                            stroke="white"
                            strokeWidth="4"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
