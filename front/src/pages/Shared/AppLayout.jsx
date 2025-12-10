//import React from "react";
import styles from "../../css/client/Client.module.css";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header.jsx";
import SnackAlert from "../../components/commun/AlertSnack.jsx";

const AppLayout = () => {
  return (
    <div className={styles.page}>
      <SnackAlert

      />
      {/*<Header role={"client"}/>*/}
      <Header role={"admin"} />
      {/*<main className={styles.mainContainer}>
          <Outlet />
        </main>*/}
      <main
        className={styles.mainContainer}
        style={{
          background: "#f1f5f9", width: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px", minHeight: "100vh"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
