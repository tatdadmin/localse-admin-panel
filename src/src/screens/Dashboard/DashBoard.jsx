import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/userAuthSlice";
import { ADD_NOTICE, ADD_NOTIFICATION, DELETE_NOTICE } from "../../apis/Apis";
import getNotices from "../../redux/apicalls/getNotices";
import DateWiseCount from "../reports/DateWiseCount";
import AddServices from "../services/Services";

// Menu bar icon component
const MenuIcon = ({ onClick }) => (
  <div style={styles.menuIcon} onClick={onClick}>
    <div style={styles.menuBar}></div>
    <div style={styles.menuBar}></div>
    <div style={styles.menuBar}></div>
  </div>
);

const SideBar = ({ onSelect, selectedComponent, isOpen, onClose }) => {
  // Combine base sidebar styles with conditional mobile styles
  const sidebarStyle = {
    ...styles.sidebar,
    ...(window.innerWidth <= 768 && {
      position: "fixed",
      transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease-in-out",
      zIndex: 999,
      height: "100%",
    }),
  };

  return (
    <div style={sidebarStyle}>
      <div style={styles.sidebarHeader}>
        <h1 style={styles.sidebarTitle}>LOCALSE</h1>
        {window.innerWidth <= 768 && (
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <div style={styles.menu}>
        <div
          style={{
            ...styles.menuItem,
            backgroundColor: selectedComponent === "notice" ? "#f8f9fa" : "white",
          }}
          onClick={() => {
            onSelect("notice");
            if (window.innerWidth <= 768) onClose();
          }}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = selectedComponent === "notice" ? "#f8f9fa" : "white")}
        >
          Notice
        </div>
        <div
          style={{
            ...styles.menuItem,
            backgroundColor: selectedComponent === "notification" ? "#f8f9fa" : "white",
          }}
          onClick={() => {
            onSelect("notification");
            if (window.innerWidth <= 768) onClose();
          }}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = selectedComponent === "notification" ? "#f8f9fa" : "white")}
        >
          Notification
        </div>

        <div
          style={{
            ...styles.menuItem,
            backgroundColor: selectedComponent === "reports" ? "#f8f9fa" : "white",
          }}
          onClick={() => {
            onSelect("reports");
            if (window.innerWidth <= 768) onClose();
          }}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = selectedComponent === "reports" ? "#f8f9fa" : "white")}
        >
          Reports
        </div>
        <div
          style={{
            ...styles.menuItem,
            backgroundColor: selectedComponent === "services" ? "#f8f9fa" : "white",
          }}
          onClick={() => {
            onSelect("services");
            if (window.innerWidth <= 768) onClose();
          }}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = selectedComponent === "services" ? "#f8f9fa" : "white")}
        >
          Services
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div style={styles.header}>
      {window.innerWidth <= 768 && <MenuIcon onClick={toggleSidebar} />}
      <span>Employee Name</span>
      <span
        style={styles.logout}
        onMouseOver={(e) => (e.target.style.color = "darkred")}
        onMouseOut={(e) => (e.target.style.color = "red")}
        onClick={handleLogout}
      >
        Logout
      </span>
    </div>
  );
};

// Notice Component
const NoticeList = ({ onOpen }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);
  const noticeloader = useSelector((e) => e?.NoticeSlice?.loader);
  const noticeData = useSelector((e) => e?.NoticeSlice?.data);

  const handleDelete = async (id) => {
    try {
      const res = await DELETE_NOTICE({ id: id });
      console.log(res);
      dispatch(getNotices());
      alert(res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={styles.listContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <h2>Notices</h2>
        <button
          onClick={() => onOpen("notice")}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>

      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {noticeData &&
          noticeData.map((notice) => (
            <div key={notice?._id} style={styles.listItem}>
              {notice?.content}
              <div>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(notice._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Notification Component
const NotificationList = ({ onOpen }) => {
  return (
    <div style={styles.listContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <h2>Notifications</h2>
        <button
          onClick={() => onOpen("Notification")}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>
      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {/* Notification list items would go here */}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    mobile: "",
    subject: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    mobile: "",
    subject: "",
    content: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (type !== "notice") {
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      }
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ mobile: "", subject: "", content: "" });
    setErrors({ mobile: "", subject: "", content: "" });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: window.innerWidth <= 768 ? "90%" : "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          {type === "notice" ? "Add Notice" : "Add Notification"}
        </h2>

        {type !== "notice" && (
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.mobile && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {errors.mobile}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {errors.subject && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.subject}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              minHeight: "80px",
            }}
          />
          {errors.content && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.content}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState("notice");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("notice");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarOpen(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  const dispatch = useDispatch();
  
  const handleSubmit = async (data) => {
    try {
      let response;
      if (modalType === "notice") {
        response = await ADD_NOTICE({
          subject: data?.subject,
          content: data?.content,
          to_all: "1",
          service_provider_mobile_number: data?.mobile,
        });

        if (response?.status_code === 200) {
          dispatch(getNotices());
        }
      } else {
        response = await ADD_NOTIFICATION({
          subject: data?.subject,
          content: data?.content,
          to_all: "0",
          service_provider_mobile_number: data?.mobile,
        });
      }

      if (response?.status_code === 200) {
        alert(response?.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Overlay to close sidebar when clicking outside on mobile
  const Overlay = ({ isOpen, onClose }) => {
    if (!isOpen || windowWidth > 768) return null;
    
    return (
      <div 
        style={styles.overlay}
        onClick={onClose}
      />
    );
  };

  return (
    <div style={styles.container}>
      <SideBar 
        onSelect={setSelectedComponent} 
        selectedComponent={selectedComponent} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Overlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={styles.mainContainer}>
        <Header toggleSidebar={toggleSidebar} />
        <div style={styles.content}>
          {selectedComponent === "notice" ? (
            <NoticeList onOpen={openModal} />
          ) : selectedComponent === "reports" ? (
            <DateWiseCount />
          ) : selectedComponent === "services" ? 
            <AddServices /> : (
            <NotificationList onOpen={openModal} />
          )}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        onSubmit={(e) => handleSubmit(e)}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f4f4",
    overflow: "hidden",
    position: "relative",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#121212",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sidebarTitle: {
    fontSize: "24px",
    margin: 0,
  },
  closeButton: {
    background: "none",
    color: "white",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0 10px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  menuItem: {
    background: "white",
    color: "black",
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: "15px 20px",
    fontWeight: "bold",
  },
  logout: {
    color: "red",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    height: "calc(100vh - 60px)",
  },
  listContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  menuIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "24px",
    height: "20px",
    cursor: "pointer",
  },
  menuBar: {
    width: "100%",
    height: "3px",
    backgroundColor: "#333",
    margin: "2px 0",
    borderRadius: "2px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 998,
  }
};

export default Dashboard;