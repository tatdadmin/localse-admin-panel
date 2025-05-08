import React, { useState, useEffect } from "react";
import { ADD_NEW_SERVICE, DELETE_SERVICE, GET_SERVICES } from "../../apis/Apis";

const AddServices = () => {
  const [serviceType, setServiceType] = useState("");
  const [serviceTypeSynonym, setServiceTypeSynonym] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Home Services");
  //   const [serviceActiveStatus, setServiceActiveStatus] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Home Services",
    "Personal Services",
    "Cleaning & Maintenance",
    "Shifting & Transport",
    "Event Services",
    "IT & Education",
    "Health & Wellness",
    "Government & Legal",
    "Construction & Labour",
    "Business & Office",
  ];

  const handleAddService = () => {
    if (!serviceType.trim()) {
      alert("Service type cannot be empty");
      return;
    }

    if (!serviceTypeSynonym.trim()) {
      alert("Service type synonym cannot be empty");
      return;
    }

    const newService = {
      //   _id: Date.now().toString(), // Generate a simple unique ID
      service_type: serviceType,
      service_type_synonym: `${serviceTypeSynonym},${serviceType}`,
      service_category: serviceCategory,
    };

    addNewService(newService);

    // setServices([...services, newService]);
  };

  const addNewService = async (service) => {
    try {
      const res = await ADD_NEW_SERVICE(service);
      resetForm();
      //   alert("Service added successfully");
      alert(res?.message);
      getServices();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setServiceType("");
    setServiceTypeSynonym("");
  };

  const getServices = async () => {
    try {
      setIsLoading(true);
      const res = await GET_SERVICES();
      setServices(res?.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  //   const handleDelete = (id) => {
  //     const updatedServices = services.filter((service) => service._id !== id);
  //     setServices(updatedServices);
  //     alert("Service deleted successfully");
  //   };

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.service_category
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      service.service_type_synonym
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const deleteservice = async (id) => {
    try {
      const res = await DELETE_SERVICE({
        id,
      });
      console.log(res);
      getServices();
    } catch (err) {
      console.log(err);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      borderBottom: "1px solid #eaeaea",
      paddingBottom: "10px",
    },
    formContainer: {
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "25px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    formRow: {
      display: "flex",
      flexDirection: "row",
      gap: "15px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    fieldContainer: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      minWidth: "200px",
    },
    fieldLabel: {
      marginBottom: "8px",
      fontWeight: "600",
      fontSize: "14px",
      color: "#333",
    },
    requiredLabel: {
      color: "#dc3545",
      marginLeft: "4px",
    },
    input: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ced4da",
      width: "100%",
      fontSize: "14px",
      transition: "border-color 0.15s ease-in-out",
    },
    select: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ced4da",
      width: "100%",
      fontSize: "14px",
      backgroundColor: "white",
      height: "41px",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "10px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      transition: "background-color 0.15s ease-in-out",
    },
    searchContainer: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
    },
    listContainer: {
      maxHeight: "calc(100vh - 400px)",
      overflowY: "auto",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
    },
    listEmpty: {
      padding: "15px",
      textAlign: "center",
      color: "#6c757d",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      borderBottom: "1px solid #eee",
      backgroundColor: "white",
      transition: "background-color 0.1s ease-in-out",
    },
    serviceInfo: {
      flex: "1",
    },
    serviceName: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "5px",
    },
    serviceCategory: {
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "6px",
    },
    serviceDetails: {
      fontSize: "13px",
      color: "#495057",
      marginTop: "6px",
    },
    statusActive: {
      color: "#28a745",
      fontWeight: "500",
    },
    statusInactive: {
      color: "#dc3545",
      fontWeight: "500",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: "13px",
      transition: "background-color 0.15s ease-in-out",
    },
    loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
    },
    loaderSpinner: {
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #007BFF",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      animation: "spin 1s linear infinite",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Services</h2>
      </div>

      {/* Add Service Form */}
      <div style={styles.formContainer}>
        <div style={styles.formRow}>
          <div style={styles.fieldContainer}>
            <label style={styles.fieldLabel}>
              Service Type
              <span style={styles.requiredLabel}>*</span>
            </label>
            <input
              type="text"
              placeholder="Service Type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldContainer}>
            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>Choose Category</label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                style={styles.select}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={styles.formRow}>
          <label style={styles.fieldLabel}>
            Service Type Synonym
            <span style={styles.requiredLabel}>*</span>
          </label>
          <input
            type="text"
            placeholder="Service Type Synonym"
            value={serviceTypeSynonym}
            onChange={(e) => setServiceTypeSynonym(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.buttonRow}>
          <button onClick={handleAddService} style={styles.button}>
            Add Service
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <label style={styles.fieldLabel}>Search Services</label>
        <input
          type="text"
          placeholder="Search by service type, category or synonym..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Services List */}
      {isLoading ? (
        <div style={styles.loader}>
          <div
            style={{
              ...styles.loaderSpinner,
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div key={service._id} style={styles.listItem}>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceName}>{service.service_type}</div>
                  <div style={styles.serviceCategory}>
                    Category: {service.service_category}
                  </div>
                  <div style={styles.serviceDetails}>
                    Synonym: {service.service_type_synonym}
                  </div>
                  <div style={styles.serviceDetails}>
                    Status:{" "}
                    <span
                      style={
                        service.service_active_status === "1"
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {service.service_active_status === "1"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteservice(service._id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div style={styles.listEmpty}>No services found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddServices;
