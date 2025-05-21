import { useState, useEffect } from "react";
import {
  GET_CUSTOMER_CLICKS_IN_SERVICEPROVIDERCLICK_SECTION,
  GET_SERVICE_PROVIDER_CLICKS_DATA,
} from "../../apis/Apis";

const ServiceProviderClicks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [clicksData, setClicksData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingClicks, setLoadingClicks] = useState(false);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      try {
        // In real implementation, replace this with your actual API call
        const response = await GET_SERVICE_PROVIDER_CLICKS_DATA();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerClicks = async (date) => {
    try {
      setLoadingClicks(true);
      setSelectedDate(date);
      setModalOpen(true);

      const res = await GET_CUSTOMER_CLICKS_IN_SERVICEPROVIDERCLICK_SECTION({
        date: date,
      });

      setClicksData(res.data);
      setLoadingClicks(false);
    } catch (err) {
      console.log(err);
      setLoadingClicks(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Calculate totals for summary cards
  const totalClicks = data.reduce(
    (sum, item) => sum + item.uniqueCustomerClicks,
    0
  );
  const avgClicks =
    data.length > 0 ? (totalClicks / data.length).toFixed(2) : 0;
  const totalProviders = data.reduce(
    (sum, item) => sum + item.serviceProviderCount,
    0
  );
  const avgProviders =
    data.length > 0 ? (totalProviders / data.length).toFixed(2) : 0;

  // Format date for better display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year:'numeric',
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const styles = {
    tableHeader: {
      background:
        "linear-gradient(to right, rgb(31, 41, 55), rgb(239, 68, 68))",
      color: "white",
      textAlign: "center",
    },
    clickableHeader: {
      padding: "14px",
      minWidth: "130px",
      cursor: "pointer",
    },
    noData: {
      padding: "12px",
      textAlign: "center",
    },
    tableRow: {
      textAlign: "center",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    tableRowHover: {
      backgroundColor: "#f0f9ff !important",
    },
    rowEven: {
      backgroundColor: "#f9fafb",
    },
    rowOdd: {
      backgroundColor: "#ffffff",
    },
    tableCell: {
      padding: "12px",
      textAlign:"center"
    },
    totalsRow: {
      backgroundColor: "#f3f4f6",
      fontWeight: "bold",
      borderTop: "2px solid #e5e7eb",
      textAlign: "center",
    },
    summaryCards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
      marginTop: "24px",
    },
    summaryCard: {
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "500",
    },
    cardValue: {
      fontSize: "24px",
      fontWeight: "700",
      marginTop: "8px",
    },
    clickableDate: {
      cursor: "pointer",
      color: "#2563eb",
      textDecoration: "underline",
    },
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1050,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "900vw",
      maxHeight: "80vh",
      overflow: "auto",
      padding: "20px",
      position: "relative",
    },
    modalHeader: {
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "10px",
      marginBottom: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
    },
    modalTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    modalTableHeader: {
        background:
        "linear-gradient(to right, rgb(31, 41, 55), rgb(239, 68, 68))",
      padding: "12px",
      textAlign: "left",
      fontWeight: "bold",
      borderBottom: "2px solid #e5e7eb",
    },
    modalTableCell: {
      padding: "12px",
      borderBottom: "1px solid #e5e7eb",
    },
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Service Provider Clicks Report</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr style={styles.tableHeader}>
                  <th
                    style={styles.clickableHeader}
                    onClick={() => handleSort("date")}
                    className="text-nowrap"
                  >
                    Date
                    {sortField === "date" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.clickableHeader}
                    onClick={() => handleSort("uniqueCustomerClicks")}
                  >
                    Customer Clicks
                    {sortField === "uniqueCustomerClicks" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    style={styles.clickableHeader}
                    onClick={() => handleSort("serviceProviderCount")}
                  >
                    Registration
                    {sortField === "serviceProviderCount" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr
                      key={item.date}
                      style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                      //   className="hover:bg-blue-50"
                    >
                      <td style={styles.tableCell}>
                        <span
                        //   style={styles.clickableDate}
                        >
                          {formatDate(item.date)}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          onClick={() => getCustomerClicks(item.date)}
                          style={styles.clickableDate}
                        >
                          {item.uniqueCustomerClicks}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {item.serviceProviderCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={styles.noData}>
                      No data available
                    </td>
                  </tr>
                )}
                <tr style={styles.totalsRow}>
                  <td style={styles.tableCell}>Total</td>
                  <td style={styles.tableCell}>{totalClicks}</td>
                  <td style={styles.tableCell}>{totalProviders}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for displaying customer clicks data */}
      {modalOpen && (
        <div style={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h5>Customer Clicks for {formatDate(selectedDate)}</h5>
              <button
                style={styles.closeButton}
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {loadingClicks ? (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table style={styles.modalTable}>
                  <thead>
                    <tr>
                      <th style={styles.modalTableHeader}>Customer Mobile</th>
                      <th style={styles.modalTableHeader}>
                        Service Provider Mobile
                      </th>
                      <th style={styles.modalTableHeader}>Service Type</th>
                      <th style={styles.modalTableHeader}>Business Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clicksData.length > 0 ? (
                      clicksData.map((click, index) => (
                        <tr
                          key={index}
                          style={
                            index % 2 === 0 ? styles.rowEven : styles.rowOdd
                          }
                        >
                          <td style={styles.modalTableCell}>
                            {click.customer_mobile_number}
                          </td>
                          <td style={styles.modalTableCell}>
                            {click.service_provider_mobile_number}
                          </td>
                          <td style={styles.modalTableCell}>
                            {click.service_type}
                          </td>
                          <td style={styles.modalTableCell}>
                            {click.business_name}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={styles.noData}>
                          No customer clicks data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderClicks;
