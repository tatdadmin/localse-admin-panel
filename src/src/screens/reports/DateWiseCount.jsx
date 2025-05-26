import React, { useEffect, useState } from "react";
import { DATE_WISE_REPORT } from "../../apis/Apis";

const DateWiseCount = () => {
  const [counts, setCounts] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [ascending, setAscending] = useState(false);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    dateWiseReport();
    setLoading(true)
  }, []);

  const dateWiseReport = async () => {
    try {
      const res = await DATE_WISE_REPORT();
      setCounts(res?.data);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };

  const getSortedData = () => {
    return [...counts].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string") {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return ascending ? valA - valB : valB - valA;
      }
    });
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return ascending ? " ▲" : " ▼";
    }
    return "";
  };

  // Calculate totals
  const getTotals = () => {
    return counts.reduce(
      (totals, item) => ({
        totalPayments: totals.totalPayments + (item.payment_mobile_count || 0),
        totalRegistrations: totals.totalRegistrations + (item.registered_payment_count || 0),
        totalRefunds: totals.totalRefunds + (item.refund_count || 0),
        totalLoggedIn: totals.totalLoggedIn + (item.login_status_count || 0),
      }),
      {
        totalPayments: 0,
        totalRegistrations: 0,
        totalRefunds: 0,
        totalLoggedIn: 0,
      }
    );
  };

  const totals = getTotals();

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2
          style={{ marginBottom: "30px", fontSize: "24px", color: "#1f2937" }}
        >
          📊 Payment & Registration Summary
        </h2>

        {/* Summary Cards */}


        {
          loading?<>
          <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
            <span>⏳ Loading data, please wait...</span>
          </div>
          
          </>: <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            }}
          >
            <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "5px" }}>
              💰 Total Payments
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totals.totalPayments}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
            }}
          >
            <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "5px" }}>
              📝 Total Registrations
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totals.totalRegistrations}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
            }}
          >
            <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "5px" }}>
              ↩️ Total Refunds
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totals.totalRefunds}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
            }}
          >
            <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "5px" }}>
              🔐 Total Logged In
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totals.totalLoggedIn}
            </div>
          </div>
        </div>


        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "linear-gradient(to right, rgb(31, 41, 55), rgb(239, 68, 68))",
                color: "white",
                textAlign: "center",
              }}
            >
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("date")}
              >
                📅 Date{renderSortIcon("date")}
              </th>
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("payment_mobile_count")}
              >
                💰 Payment{renderSortIcon("payment_mobile_count")}
              </th>
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("registered_payment_count")}
              >
                📝 Registered{renderSortIcon("registered_payment_count")}
              </th>
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("refund_count")}
              >
                ↩️ Refunds{renderSortIcon("refund_count")}
              </th>
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("login_status_count")}
              >
                🔐 Logged In{renderSortIcon("login_status_count")}
              </th>
            </tr>
          </thead>
          <tbody>
            {counts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ padding: "12px", textAlign: "center" }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              getSortedData().map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <td style={{ padding: "12px" }}>{item.date}</td>
                  <td style={{ padding: "12px" }}>
                    {item.payment_mobile_count}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {item.registered_payment_count}
                  </td>
                  <td style={{ padding: "12px" }}>{item.refund_count}</td>
                  <td style={{ padding: "12px" }}>{item.login_status_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </>
        }
       
      </div>
    </div>
  );
};

export default DateWiseCount;