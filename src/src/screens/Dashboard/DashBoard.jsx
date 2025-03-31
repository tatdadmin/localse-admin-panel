import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/userAuthSlice";
import { ADD_NOTICE, ADD_NOTIFICATION, DELETE_NOTICE } from "../../apis/Apis";
import getNotices from "../../redux/apicalls/getNotices";

const SideBar = ({ onSelect }) => {
  return (
    <div style={styles.sidebar}>
      <h1 style={styles.sidebarTitle}>LOCALSE</h1>
      <div style={styles.menu}>
        <div
          style={styles.menuItem}
          onClick={() => onSelect("notice")}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          Notice
        </div>
        <div
          style={styles.menuItem}
          onClick={() => onSelect("notification")}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          Notification
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div style={styles.header}>
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
  console.log(noticeloader, "noticeloader");

  const handleDelete = async (id) => {
    try {
      const res = await DELETE_NOTICE({ id: id });
      console.log(res);
      dispatch(getNotices());
      alert(res?.message);
    } catch (error) {
      console.log(error);
    }
    //   setNotices(notices.filter((notice) => notice.id !== id));
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

      {noticeData &&
        noticeData.map((notice) => (
          <div key={notice?._id} style={styles.listItem}>
            {notice?.content}
            <div>
              {/* <button style={styles.editButton}>Edit</button> */}
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
          //   onClick={() => alert("Click Add Notification")}
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
      {/* {notifications.map((notif) => (
        <div key={notif.id} style={styles.listItem}>
          {notif.text}
          <div>
            <button style={styles.editButton}>Edit</button>
            <button
              style={styles.deleteButton}
              onClick={() => handleDelete(notif.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))} */}
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

    // Remove error message when user starts typing
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

    // Reset form and errors after submission
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
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
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
      console.log(response, "API Response");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <SideBar onSelect={setSelectedComponent} />
      <div style={styles.mainContainer}>
        <Header />
        <div style={styles.content}>
          {selectedComponent === "notice" ? (
            <NoticeList onOpen={openModal} />
          ) : (
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
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#121212",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  sidebarTitle: {
    fontSize: "24px",
    marginBottom: "30px",
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
  },
  content: {
    flex: 1,
    padding: "20px",
  },
  listContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  modalTitle: {
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    resize: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  submitButton: {
    background: "#007BFF",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  closeButton: {
    background: "red",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Dashboard;
