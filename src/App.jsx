// App.js
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SalarySlipForm from "./Components/SalarySlipForm";
import { FaPlus, FaFileExport } from "react-icons/fa";
import SalarySlipTable from "./Components/SalarySlipTable";
import * as XLSX from "xlsx";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [attendance, setAttendance] = useState("");
  const [month, setMonth] = useState("");
  const [salarySlips, setSalarySlips] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleDeleteSlip = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary slip?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://asmserver.onrender.com/api/salary-slips/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setSalarySlips(salarySlips.filter((s) => s._id !== id));
        toast.success(result.message || "Salary slip deleted", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        throw new Error(result.error || "Failed to delete");
      }
    } catch (err) {
      toast.error(err.message || "Server error", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const exportToExcel = () => {
    try {
      if (salarySlips.length === 0) {
        toast.warn("No salary slips to export", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        return;
      }

      const data = salarySlips.map((slip) => ({
        Employee: slip.user,
        Month: slip.month,
        "Days Worked": slip.days,
        "Salary (₹)": slip.salary,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Slips");

      worksheet["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Salary_Slips_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Salary slips exported successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      console.error("Export error:", err.stack);
      toast.error("Failed to export salary slips: " + err.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setShouldRedirect(true);
        setLoading(false);
        return;
      }

      try {
        const [usersResponse, slipsResponse] = await Promise.all([
          fetch("https://asmserver.onrender.com/api/employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://asmserver.onrender.com/api/salary-slips", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (usersResponse.status === 401 || usersResponse.status === 403) {
          throw new Error("Unauthorized access. Please log in again.");
        }
        if (slipsResponse.status === 401 || slipsResponse.status === 403) {
          throw new Error("Unauthorized access to salary slips");
        }

        const usersData = await usersResponse.json();
        const slipsData = await slipsResponse.json();

        if (!Array.isArray(usersData)) {
          console.error("Users data received:", usersData);
          throw new Error(usersData.error || "Users data is not an array");
        }
        if (!Array.isArray(slipsData)) {
          console.error("Salary slips data received:", slipsData);
          throw new Error(
            slipsData.error || "Salary slips data is not an array"
          );
        }

        setUsers(usersData);
        setSalarySlips(slipsData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.stack);
        setError(err.message || "Failed to fetch data");
        setShouldRedirect(true);
        setLoading(false);
        toast.error(err.message || "Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !attendance || !month) {
      toast.error("Please fill all fields", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const user = users.find((u) => u._id === selectedUser);
    if (!user) {
      toast.error("Employee not found", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const daysWorked = parseInt(attendance);
    if (daysWorked < 0 || daysWorked > 31) {
      toast.error("Invalid number of days", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const dailySalary = user.baseSalary / 26;
    const calculatedSalary = (dailySalary * daysWorked).toFixed(2);

    try {
      const response = await fetch(
        "https://asmserver.onrender.com/api/salary-slip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: selectedUser, month, daysWorked }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setSalarySlips([
          ...salarySlips,
          {
            _id: result._id,
            user: user.username,
            month,
            days: daysWorked,
            salary: calculatedSalary,
            pdfUrl: result.pdfUrl,
          },
        ]);
        setError("");
        setSelectedUser("");
        setAttendance("");
        setMonth("");
        setIsModalOpen(false);
        toast.success(
          `Salary slip generated for ${user.username} - ${month} - ₹${calculatedSalary}`,
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      } else {
        toast.error(result.error || "Failed to generate salary slip", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error("Server error: " + err.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (shouldRedirect) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff, #c3dafe)",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            color: "#4b5563",
            fontFamily: "'Roboto', sans-serif",
            animation: "pulse 1.5s infinite",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff, #c3dafe)",
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
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/employees")}
          style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Poppins', sans-serif",
            animation: "pulse 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #2563eb, #6d28d9)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #3b82f6, #7c3aed)")
          }
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="View Employees Dashboard"
        >
          <FaPlus /> Employees Dashboard
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Poppins', sans-serif",
            animation: "pulse 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #2563eb, #6d28d9)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #3b82f6, #7c3aed)")
          }
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="Open Generate Salary Slip Modal"
        >
          <FaPlus /> Generate
        </button>
        <button
          onClick={exportToExcel}
          style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            fontFamily: "'Poppins', sans-serif",
            animation: "pulse 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #2563eb, #6d28d9)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #3b82f6, #7c3aed)")
          }
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          aria-label="Export salary slips to Excel"
        >
          <FaFileExport /> Export to XLSX
        </button>
      </div>
      <SalarySlipForm
        users={users}
        onSubmit={handleSubmit}
        error={error}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        attendance={attendance}
        setAttendance={setAttendance}
        month={month}
        setMonth={setMonth}
        onClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
      <SalarySlipTable salarySlips={salarySlips} onDelete={handleDeleteSlip} />
    </div>
  );
};

export default App;
