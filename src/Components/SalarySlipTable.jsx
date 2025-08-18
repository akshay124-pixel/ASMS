import { FaTrash } from "react-icons/fa";

const SalarySlipTable = ({ salarySlips, onDelete }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(15px)",
        borderRadius: "24px",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
        padding: "0rem",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        maxWidth: "1400px", // Increased width for a wider table
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: "500px", // Kept height for scrolling
          overflowY: "auto", // Enable vertical scrollbar
          overflowX: "auto", // Preserve horizontal scrollbar
          scrollbarWidth: "thin", // Thin scrollbar for Firefox
          scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.2)", // Custom scrollbar colors
        }}
        className="custom-scrollbar"
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 4px;
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
            fontSize: "1rem", // Slightly increased font size for readability
            fontFamily: "'Roboto', sans-serif",
            color: "#1f2937",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "linear-gradient(90deg, #2563eb, #6d28d9)", // Gradient header
              zIndex: 1, // Keep header above scrolling content
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
                  padding: "1.4rem 2rem", // Increased padding for wider columns
                  textAlign: "left",
                  borderTopLeftRadius: "12px",
                  width: "30%", // Adjusted for wider table
                }}
              >
                Employee
              </th>
              <th
                style={{
                  padding: "1.4rem 2rem",
                  textAlign: "left",
                  width: "25%", // Adjusted for balance
                }}
              >
                Month
              </th>
              <th
                style={{
                  padding: "1.4rem 2rem",
                  textAlign: "left",
                  width: "20%",
                }}
              >
                Days
              </th>
              <th
                style={{
                  padding: "1.4rem 2rem",
                  textAlign: "left",
                  width: "20%",
                }}
              >
                Salary (₹)
              </th>
              <th
                style={{
                  padding: "1.4rem 2rem",
                  textAlign: "left",
                  width: "15%",
                }}
              >
                Download
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
            {salarySlips.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
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
                  No salary slips available
                </td>
              </tr>
            ) : (
              salarySlips.map((slip, index) => (
                <tr
                  key={slip._id}
                  style={{
                    background:
                      index % 2 === 0
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(224, 242, 254, 0.2)",
                    borderBottom:
                      index < salarySlips.length - 1
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
                      padding: "1.4rem 2rem", // Increased padding
                      color: "#1f2937",
                      fontWeight: "500",
                    }}
                  >
                    {slip.user}
                  </td>
                  <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                    {slip.month}
                  </td>
                  <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                    {slip.days}
                  </td>
                  <td style={{ padding: "1.4rem 2rem", color: "#1f2937" }}>
                    ₹{slip.salary}
                  </td>
                  <td style={{ padding: "1.4rem 2rem" }}>
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL
                      }/download/${slip.pdfUrl.split("/").pop()}`}
                      style={{
                        color: "#ffffff",
                        background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
                        textDecoration: "none",
                        fontWeight: "600",
                        padding: "0.7rem 1.4rem",
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                        display: "inline-block",
                        fontFamily: "'Roboto', sans-serif",
                        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
                      }}
                      download={`${slip.user}-${slip.month}-salary-slip.pdf`}
                    >
                      Download
                    </a>
                  </td>
                  <td
                    style={{
                      padding: "1.4rem 2rem",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <button
                      className="bin-button"
                      onClick={() => onDelete(slip._id)}
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
  );
};

export default SalarySlipTable;
