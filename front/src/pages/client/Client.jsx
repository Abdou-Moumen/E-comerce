//import React from "react";
import styles from "../../css/client/Client.module.css";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header.jsx";

const Client = () => {
  return (
    <>
      <div className={styles.page}>
        {/*<Header role={"client"}/>*/}
        <Header role={"admin"} />
        <main className={styles.mainContainer}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Client;
