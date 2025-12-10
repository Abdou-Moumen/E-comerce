// Header.js
import React, { useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import styles from "../../css/header/Header.module.css";
import Logo from "../../assets/logoClient.svg";
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AdminNavigation from './AdminNavigation';
import cartIcn from "../../assets/cartIcon.svg";
import searchIcon from "../../assets/searchIcon.svg";

const Header = ({ role = "client" }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleClientLogoClick = () => {
        navigate("/");
    }

    const handleAdminLogoClick = () => {
        navigate("/admin/");
    }

    return (
        <div className={styles.header}>
            {role === "client" ? (
                <div className={styles.clientHeader}>
                    <div className={styles.cartIconContainer}>
                        <img src={searchIcon} alt={"cart"} className={styles.icon}
                            style={{}}
                        />
                    </div>
                    <img src={Logo} alt={"logo"} className={styles.clientLogo} onClick={handleClientLogoClick} />
                    <div className={styles.cartIconContainer}>
                        <img src={cartIcn} alt={"cart"} className={styles.icon}
                            onClick={() => navigate("/panier")}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.adminHeader}>
                    <div className={styles.menuIconContainer}>
                        <IconButton
                            aria-label="menu"
                            size="medium"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuRoundedIcon
                                fontSize="medium"
                                style={{ color: "#000000" }}
                            />
                        </IconButton>
                    </div>
                    <AdminNavigation
                        open={open}
                        onClose={toggleDrawer(false)}
                        onLogoClick={handleAdminLogoClick}
                    />
                    <div className={styles.adminLogoContainer}>
                        <img src={Logo} alt={"logo"} className={styles.adminLogo} onClick={handleAdminLogoClick} />
                    </div>
                </div>
            )}
        </div>
    );
};

Header.propTypes = {
    role: PropTypes.oneOf(["client", "admin"]),
};

export default Header;