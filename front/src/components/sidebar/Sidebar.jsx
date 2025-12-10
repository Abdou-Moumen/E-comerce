import React from "react";
import styles from "../../css/sidebar/Sidebar.module.css";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    return (<>
        <div className={styles.sidebar}>
            <h3>Shopping</h3>
            <button className={styles.closeBtn} onClick={() => {
                console.log("close sidebar");
            }}>
                <i className="fas fa-times"></i>
            </button>
        </div>
        <ul className={styles.sidebarList}>
            <li>
                <a href="#">home</a>
            </li>
            <li>
                <a href="#">about</a>
            </li>
            <li>
                <a href="#">products</a>
            </li>
            <li>
                <a href="#">contact</a>
            </li>
            <li className={isSelected ? styles.listItemActive : styles.listItem}>
                <div className={styles.listItemLeft}>
                    <NavLink to={""}
                             className={styles.link}>
                        <img src={icon} alt={name}/>
                        <span>{name}</span>
                    </NavLink>
                </div>
            </li>
        </ul>
    </>);
}

export default Sidebar;