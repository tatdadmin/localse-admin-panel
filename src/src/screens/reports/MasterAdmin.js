import React, { useState } from "react";
import {
  CHANGE_SERVICE_PROVIDER_NUMBER,
  CHANGE_SERVICE_PROVIDER_SERVICE_TYPE,
} from "../../apis/Apis";

const MasterAdmin = () => {
  // State for changing mobile number
  const [currentNumber, setCurrentNumber] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for changing service type
  const [serviceProviderMobile, setServiceProviderMobile] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [serviceTypeResponse, setServiceTypeResponse] = useState(null);
  const [serviceTypeLoading, setServiceTypeLoading] = useState(false);
  const [serviceTypeError, setServiceTypeError] = useState(null);



  const changeServiceProviderNumber = async () => {
    if (!currentNumber || !newNumber) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await CHANGE_SERVICE_PROVIDER_NUMBER({
        service_provider_mobile_number: currentNumber,
        new_mobile_number: newNumber,
      });
      setResponse(res);
    } catch (error) {
      console.log(error);
      setError(
        error.message ||
          "An error occurred while changing the service provider number"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentNumber("");
    setNewNumber("");
    setResponse(null);
    setError(null);
  };

  const changeServiceProviderServiceType = async () => {
    if (!serviceProviderMobile || !newServiceType) {
      setServiceTypeError("Both mobile number and service type are required");
      return;
    }

    setServiceTypeLoading(true);
    setServiceTypeError(null);
    setServiceTypeResponse(null);

    try {
      const res = await CHANGE_SERVICE_PROVIDER_SERVICE_TYPE({
        service_provider_mobile_number: serviceProviderMobile,
        new_service_type: newServiceType,
      });
      setServiceTypeResponse(res);
    } catch (error) {
      console.log(error);
      setServiceTypeError(
        error.message ||
          "An error occurred while changing the service type"
      );
    } finally {
      setServiceTypeLoading(false);
    }
  };

  const handleServiceTypeReset = () => {
    setServiceProviderMobile("");
    setNewServiceType("");
    setServiceTypeResponse(null);
    setServiceTypeError(null);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Change Mobile Number Section */}
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Change Service Provider Mobile Number</h4>
            </div>
            <div className="card-body">
              <div>
                <div className="mb-3">
                  <label htmlFor="currentNumber" className="form-label">
                    Current Service Provider Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="currentNumber"
                    value={currentNumber}
                    onChange={(e) => setCurrentNumber(e.target.value)}
                    placeholder="Enter current mobile number"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newNumber" className="form-label">
                    New Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="newNumber"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="Enter new mobile number"
                    disabled={loading}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={loading || !currentNumber || !newNumber}
                    onClick={changeServiceProviderNumber}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Changing...
                      </>
                    ) : (
                      "Change Number"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {response && (
                <div className="mt-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <pre
                        className="mb-0"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {JSON.stringify(response.message, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Service Type Section */}
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Change Service Provider Service Type</h4>
            </div>
            <div className="card-body">
              <div>
                <div className="mb-3">
                  <label htmlFor="serviceProviderMobile" className="form-label">
                    Service Provider Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="serviceProviderMobile"
                    value={serviceProviderMobile}
                    onChange={(e) => setServiceProviderMobile(e.target.value)}
                    placeholder="Enter service provider mobile number"
                    disabled={serviceTypeLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newServiceType" className="form-label">
                    New Service Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="newServiceType"
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    placeholder="Enter new service type (e.g., Unisex Salon, Beauty Salon, etc.)"
                    disabled={serviceTypeLoading}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={serviceTypeLoading || !serviceProviderMobile || !newServiceType}
                    onClick={changeServiceProviderServiceType}
                  >
                    {serviceTypeLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Changing...
                      </>
                    ) : (
                      "Change Service Type"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleServiceTypeReset}
                    disabled={serviceTypeLoading}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {serviceTypeError && (
                <div className="alert alert-danger mt-3" role="alert">
                  <strong>Error:</strong> {serviceTypeError}
                </div>
              )}

              {serviceTypeResponse && (
                <div className="mt-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <pre
                        className="mb-0"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {JSON.stringify(serviceTypeResponse.message, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdmin;