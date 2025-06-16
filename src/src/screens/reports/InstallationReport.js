import { useEffect, useState } from "react";
import { INSTALLATION_REPORTS } from "../../apis/Apis";

const InstallationReport = () => {
  const [reportData, setReportData] = useState([]);
  const [targetArea, setTargetArea] = useState("1");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-3">Installation Report</h3>
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
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title">Total Clicks</h5>
                    <h2 className="text-info">
                      {reportData.reduce((sum, item) => sum + item.clicks, 0)}
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

          {/* Table */}
          {!loading && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Onboarding</th>
                    <th scope="col">Installation</th>
                    <th scope="col">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length > 0 ? (
                    reportData.map((item, index) => (
                      <tr key={index}>
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
                          <span className="badge bg-info">{item.clicks}</span>
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

          {/* Summary Cards */}
         
        </div>
      </div>
    </div>
  );
};

export default InstallationReport;
