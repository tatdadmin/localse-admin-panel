import React from "react";
import { useDispatch } from "react-redux";
import { setUserAuthStates } from "../../redux/slices/userAuthSlice";

const SideBar = () => {
  return (
    <div style={styles.sidebar}>
      <h1 style={styles.sidebarTitle}>LOCALSE</h1>
      <div style={styles.menu}>
        <div
          style={styles.menuItem}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          Notice
        </div>
        <div
          style={styles.menuItem}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          Notification
        </div>
        <div
          style={styles.menuItem}
          onMouseOver={(e) => (e.target.style.background = "#ddd")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          More
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(
      setUserAuthStates({
        key: "jwt",
        value: null,
      })
    );

    dispatch(
      setUserAuthStates({
        key: "refreshToken",
        value: null,
      })
    );
    dispatch(
      setUserAuthStates({
        key: "login",
        value: false,
      })
    );
  };

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
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
    </div>
  );
};

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <SideBar />
      <Header />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "170vh",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    padding: 0,
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
  menuItemHover: {
    background: "#ddd",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
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
};

export default Dashboard;
