import { useEffect, useState } from "react";
import {
  INSTALLATION_REPORTS,
  INSTALLATION_REPORTS_BY_USER,
} from "../../apis/Apis";

const InstallationReport = () => {
  const [reportData, setReportData] = useState([]);
  const [targetArea, setTargetArea] = useState("1");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [filteredModalData, setFilteredModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [installedFilter, setInstalledFilter] = useState("all");

  const getReport = async (areaCode) => {
    setLoading(true);
    try {
      const res = await INSTALLATION_REPORTS({
        target_area_code: areaCode,
      });

      if (res.status_code === 200 && res.data) {
        setReportData(res.data);
      }
      console.log(res);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReport(targetArea);
  }, [targetArea]);

  const handleAreaChange = (e) => {
    setTargetArea(e.target.value);
  };

  const handleRowClick = async (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setModalLoading(true);
    
    // Reset filters and sorting when opening modal
    setSearchTerm("");
    setVerifiedFilter("all");
    setInstalledFilter("all");
    setSortField("");
    setSortDirection("asc");
    
    try {
      const res = await INSTALLATION_REPORTS_BY_USER({
        date: date,
        target_area_code: targetArea,
      });
      console.log(res)
      if (res.status_code === 200 && res.data) {
        setModalData(res.data);
        setFilteredModalData(res.data);
      } else {
        setModalData([]);
        setFilteredModalData([]);
      }
    } catch (error) {
      console.error("Error fetching modal data:", error);
      setModalData([]);
      setFilteredModalData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData([]);
    setFilteredModalData([]);
    setSelectedDate("");
    setSearchTerm("");
    setVerifiedFilter("all");
    setInstalledFilter("all");
    setSortField("");
    setSortDirection("asc");
  };

  // Sorting function
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    
    const sortedData = [...filteredModalData].sort((a, b) => {
      let aValue, bValue;
      
      switch (field) {
        case "mobile":
          aValue = a.service_provider_mobile_number || "";
          bValue = b.service_provider_mobile_number || "";
          break;
        case "business":
          aValue = a.business_name || "";
          bValue = b.business_name || "";
          break;
        case "verified":
          aValue = parseInt(a.verified || "0");
          bValue = parseInt(b.verified || "0");
          break;
        case "installed":
          aValue = parseInt(a.app_installed || "0");
          bValue = parseInt(b.app_installed || "0");
          break;
        case "clicks":
          aValue = parseInt(a.total_clicks || "0");
          bValue = parseInt(b.total_clicks || "0");
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === "string") {
        return direction === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
    
    setFilteredModalData(sortedData);
  };

  // Filter function
  const applyFilters = () => {
    let filtered = [...modalData];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        (item.service_provider_mobile_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.business_name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Verified filter
    if (verifiedFilter !== "all") {
      filtered = filtered.filter(item => item.verified === verifiedFilter);
    }
    
    // Installed filter
    if (installedFilter !== "all") {
      filtered = filtered.filter(item => item.app_installed === installedFilter);
    }
    
    setFilteredModalData(filtered);
  };

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, verifiedFilter, installedFilter, modalData]);

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-3">Installation Report</h3>
          
          {/* Summary Cards */}
          {reportData.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Onboarding</h5>
                    <h2 className="text-primary">
                      {reportData.reduce(
                        (sum, item) => sum + item.onboarding,
                        0
                      )}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Installations</h5>
                    <h2 className="text-success">
                      {reportData.reduce(
                        (sum, item) => sum + item.installation,
                        0
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dropdown for Target Area */}
          <div className="mb-3">
            <label htmlFor="targetAreaSelect" className="form-label">
              Target Area:
            </label>
            <select
              id="targetAreaSelect"
              className="form-select"
              value={targetArea}
              onChange={handleAreaChange}
              style={{ width: "200px" }}
            >
              <option value="1">Target Area 1</option>
              <option value="None">None</option>
            </select>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="d-flex justify-content-center mb-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Main Table */}
          {!loading && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Onboarding</th>
                    <th scope="col">Installation</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length > 0 ? (
                    reportData.map((item, index) => (
                      <tr 
                        key={index} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.date)}
                      >
                        <td>{item.date}</td>
                        <td>
                          <span className="badge bg-primary">
                            {item.onboarding}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {item.installation}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item.date);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Installation Details for {selectedDate} ({filteredModalData.length} of {modalData.length})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              
              {/* Filter Section */}
              <div className="modal-body border-bottom">
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label htmlFor="searchInput" className="form-label">Search:</label>
                    <input
                      type="text"
                      id="searchInput"
                      className="form-control"
                      placeholder="Search by mobile or business name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="verifiedFilter" className="form-label">Verified:</label>
                    <select
                      id="verifiedFilter"
                      className="form-select"
                      value={verifiedFilter}
                      onChange={(e) => setVerifiedFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="installedFilter" className="form-label">App Installed:</label>
                    <select
                      id="installedFilter"
                      className="form-select"
                      value={installedFilter}
                      onChange={(e) => setInstalledFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-body">
                {modalLoading ? (
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th 
                            scope="col" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('mobile')}
                          >
                            Mobile Number {getSortIcon('mobile')}
                          </th>
                          <th 
                            scope="col"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('business')}
                          >
                            Business Name {getSortIcon('business')}
                          </th>
                          <th 
                            scope="col"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('verified')}
                          >
                            Verified {getSortIcon('verified')}
                          </th>
                          <th 
                            scope="col"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('installed')}
                          >
                            App Installed {getSortIcon('installed')}
                          </th>
                          <th 
                            scope="col"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('clicks')}
                          >
                            Total Clicks {getSortIcon('clicks')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModalData.length > 0 ? (
                          filteredModalData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.service_provider_mobile_number}</td>
                              <td>{item.business_name}</td>
                              <td>
                                <span className={`badge ${item.verified === "1" ? 'bg-success' : 'bg-danger'}`}>
                                  {item.verified === "1" ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${item.app_installed === "1" ? 'bg-success' : 'bg-danger'}`}>
                                  {item.app_installed === "1" ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {item.total_clicks}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              {modalData.length === 0 ? "No data available for this date" : "No results match your filters"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showModal && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default InstallationReport;