import React, { useState } from 'react';
import { CHANGE_SERVICE_PROVIDER_NUMBER } from "../../apis/Apis";

const MasterAdmin = () => {
  const [currentNumber, setCurrentNumber] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeServiceProviderNumber = async () => {
    if (!currentNumber || !newNumber) {
      setError('Both fields are required');
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
      setError(error.message || 'An error occurred while changing the service provider number');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentNumber('');
    setNewNumber('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Change Service Provider Number</h4>
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
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Changing...
                      </>
                    ) : (
                      'Change Number'
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
                  {/* <h5 className="text-success mb-3">API Response:</h5> */}
                  <div className="card bg-light">
                    <div className="card-body">
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(response.message, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap CSS CDN */}
      {/* <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      /> */}
    </div>
  );
};

export default MasterAdmin;