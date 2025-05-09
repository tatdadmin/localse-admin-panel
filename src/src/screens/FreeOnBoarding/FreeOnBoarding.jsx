import React, { useEffect, useState } from "react";
import {
  GET_FREE_ONBOARDING_REGISTRATIONS,
  SHOW_ACTIVE_FREE_ONBOARDING_REGISTRATIONS,
  SHOW_ALL_INACTIVE_FREE_ONBOARDING_REGISTRATIONS,
  SHOW_INACTIVE_FREE_ONBOARDING_REGISTRATIONS,
} from "../../apis/Apis";
import InactiveFreeOnBarding from "./InactiveFreeOnBarding";
import "./FreeOnBoarding.css";
import ActiveFreeOnBoarding from "./ActiveFreeOnBoarding";

// All styles combined in CSS file
const FreeOnBoarding = () => {
  const [counts, setCounts] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [ascending, setAscending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inactiveData, setInactiveData] = useState([]);
  const [inactiveLoading, setInactiveLoading] = useState(false);

  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [activeData, setActiveData] = useState([]);
  const [activeLoading, setActiveLoading] = useState(false);

  //   const fetchAllInactiveRegistration = async (type) => {
  //     if (type !== "active") {
  //       setInactiveLoading(true);
  //       setIsModalOpen(true);
  //     } else {
  //       setActiveLoading(true);
  //       setIsActiveModalOpen(true);
  //     }

  //     try {
  //       const res = await SHOW_ALL_INACTIVE_FREE_ONBOARDING_REGISTRATIONS({
  //         dataType: type,
  //       });
  //       console.log(res, "-==--====--=-==-=-=-=-");
  //       if (type !== "active") {
  //         if (res?.data) {
  //           setInactiveData(res?.data);
  //         } else {
  //           setActiveData(res?.data);
  //         }
  //       }
  //       setActiveLoading(false);
  //       setInactiveLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setActiveLoading(false);

  //       setInactiveLoading(false);
  //     }
  //   };
  const fetchAllInactiveRegistration = async (type) => {
    const isActive = type === "active";

    if (isActive) {
      setActiveLoading(true);
      setIsActiveModalOpen(true);
    } else {
      setInactiveLoading(true);
      setIsModalOpen(true);
    }

    try {
      const res = await SHOW_ALL_INACTIVE_FREE_ONBOARDING_REGISTRATIONS({
        dataType: type,
      });

      console.log(res, "-==--====--=-==-=-=-=-");

      if (isActive) {
        setActiveData(res?.data || []);
      } else {
        setInactiveData(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      if (isActive) {
        setActiveLoading(false);
      } else {
        setInactiveLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRegistrationData();

    const intervalId = setInterval(() => {
      fetchRegistrationData();
    }, 1 * 60 * 1000); // 5 minutes = 300000 ms

    return () => clearInterval(intervalId);
  }, []);

  const fetchRegistrationData = async () => {
    try {
      const res = await GET_FREE_ONBOARDING_REGISTRATIONS();
      if (res?.data && Array.isArray(res.data)) {
        setCounts(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  function formatDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleInactiveClick = async (date) => {
    setInactiveLoading(true);
    setIsModalOpen(true);

    try {
      const res = await SHOW_INACTIVE_FREE_ONBOARDING_REGISTRATIONS({
        date: formatDate(date),
      });
      if (res?.data) {
        setInactiveData(res.data);
      }
      setInactiveLoading(false);
    } catch (error) {
      console.log(error);
      setInactiveLoading(false);
    }
  };

  const handleActiveClick = async (date) => {
    setActiveLoading(true);
    setIsActiveModalOpen(true);

    try {
      const res = await SHOW_ACTIVE_FREE_ONBOARDING_REGISTRATIONS({
        date: formatDate(date),
      });
      if (res?.data) {
        setActiveData(res.data);
      }
      setActiveLoading(false);
    } catch (error) {
      console.log(error);
      setActiveLoading(false);
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

  const calculateTotals = () => {
    return counts.reduce(
      (acc, curr) => ({
        totalRegistrations: acc.totalRegistrations + curr.totalRegistrations,
        active: acc.active + curr.active,
        inActive: acc.inActive + curr.inActive,
      }),
      { totalRegistrations: 0, active: 0, inActive: 0 }
    );
  };

  return (
    <div className="free-onboarding-container">
      {/* Modal rendering when isModalOpen is true */}
      {/* {isModalOpen && (
        <div
          // onClick={() => setIsModalOpen(false)}
          style={modalStyles.overlay}
        >
          <div style={modalStyles.content}>
            <button
              style={modalStyles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <InactiveFreeOnBarding
              data={inactiveData}
              loading={inactiveLoading}
            />
          </div>
        </div>
      )} */}

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)} // Click on overlay closes modal
          style={modalStyles.overlay}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent content click from closing modal
            style={modalStyles.content}
          >
            <button
              style={modalStyles.closeBtn}
              onClick={() => setIsModalOpen(false)} // Close button
            >
              ×
            </button>
            <InactiveFreeOnBarding
              data={inactiveData}
              loading={inactiveLoading}
            />
          </div>
        </div>
      )}

      {/* {isActiveModalOpen && (
        <div
          onClick={() => setIsActiveModalOpen(false)}
          style={modalStyles.overlay}
        >
          <div
          onClick={() => setIsActiveModalOpen(true)}
          
          style={modalStyles.content}>
            <button
              style={modalStyles.closeBtn}
              onClick={() => setIsActiveModalOpen(false)}
            >
              ×
            </button>

            <ActiveFreeOnBoarding data={activeData} loading={activeLoading} />
          </div>
        </div>
      )} */}

      {isActiveModalOpen && (
        <div
          onClick={() => setIsActiveModalOpen(false)} // Click on overlay closes modal
          style={modalStyles.overlay}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
            style={modalStyles.content}
          >
            <button
              style={modalStyles.closeBtn}
              onClick={() => setIsActiveModalOpen(false)} // Close button works as expected
            >
              ×
            </button>

            <ActiveFreeOnBoarding data={activeData} loading={activeLoading} />
          </div>
        </div>
      )}

      <h2 className="summary-heading">
        📊 Registration Free OnBoarding Summary
      </h2>

      {loading ? (
        <div className="loading-message">
          <p>Loading data...</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th className="clickable-header">Sr. No.</th>
              <th
                onClick={() => handleSort("date")}
                className="clickable-header"
              >
                📅 Date{sortField === "date" ? (ascending ? " ▲" : " ▼") : ""}
              </th>
              <th
                onClick={() => handleSort("totalRegistrations")}
                className="clickable-header"
              >
                📝 Total Registrations
                {sortField === "totalRegistrations"
                  ? ascending
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("active")}
                className="clickable-header"
              >
                ✅ Active Users
                {sortField === "active" ? (ascending ? " ▲" : " ▼") : ""}
              </th>
              <th
                onClick={() => handleSort("inActive")}
                className="clickable-header"
              >
                ⛔ Inactive Users
                {sortField === "inActive" ? (ascending ? " ▲" : " ▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {counts.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No data available
                </td>
              </tr>
            ) : (
              <>
                {getSortedData().map((item, index) => (
                  <tr
                    key={index}
                    className={`table-row ${
                      index % 2 === 0 ? "row-even" : "row-odd"
                    }`}
                  >
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{item.date}</td>
                    <td className="table-cell">{item.totalRegistrations}</td>
                    <td
                      onClick={() => handleActiveClick(item.date)}
                      style={{ cursor: "pointer" }}
                      className="table-cell active-cell"
                    >
                      {item.active}
                    </td>
                    <td
                      className="table-cell inactive-cell"
                      onClick={() => handleInactiveClick(item.date)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.inActive}
                    </td>
                  </tr>
                ))}
                <tr className="totals-row">
                  <td className="table-cell">Total</td>
                  <td className="table-cell"></td>
                  <td className="table-cell">
                    {calculateTotals().totalRegistrations}
                  </td>
                  <td
                    onClick={() => fetchAllInactiveRegistration("active")}
                    className="table-cell active-cell"
                  >
                    {calculateTotals().active}
                  </td>
                  <td
                    onClick={() => fetchAllInactiveRegistration("inactive")}
                    className="table-cell inactive-cell"
                  >
                    {calculateTotals().inActive}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}

      {/* Summary cards */}
      {!loading && counts.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card card-blue">
            <p className="card-title">📝 Total Registrations</p>
            <p className="card-value">{calculateTotals().totalRegistrations}</p>
          </div>
          <div
            onClick={() => fetchAllInactiveRegistration("active")}
            className="summary-card card-green"
          >
            <p className="card-title">✅ Active Users</p>
            <p className="card-value">{calculateTotals().active}</p>
          </div>
          <div
            onClick={() => fetchAllInactiveRegistration("inactive")}
            className="summary-card card-red"
          >
            <p className="card-title">⛔ Inactive Users</p>
            <p className="card-value">{calculateTotals().inActive}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeOnBoarding;

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    maxHeight: "90vh",
    maxWidth: "90vw",
    overflowY: "auto",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "24px",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
};
