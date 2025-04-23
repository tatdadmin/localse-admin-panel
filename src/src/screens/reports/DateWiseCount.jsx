import React, { useEffect, useState } from "react";
import { DATE_WISE_REPORT } from "../../apis/Apis";

const DateWiseCount = () => {
  const [counts, setCounts] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    dateWiseReport();
  }, []);

  const dateWiseReport = async () => {
    try {
      const res = await DATE_WISE_REPORT();
      setCounts(res?.data);
    } catch (error) {
      console.log(error);
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

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2
          style={{ marginBottom: "20px", fontSize: "24px", color: "#1f2937" }}
        >
          📊 Payment & Registration Summary
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead >
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
                onClick={() => handleSort("registered_payment_count")}
              >
                💰 Payment{renderSortIcon("registered_payment_count")}
              </th>
              <th
                style={{
                  padding: "14px",
                  minWidth: "130px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("payment_mobile_count")}
              >
                📝 Registered{renderSortIcon("payment_mobile_count")}
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
      </div>
    </div>
  );
};

export default DateWiseCount;
