// AdminNavigation.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ContentPasteSearchRoundedIcon from "@mui/icons-material/ContentPasteSearchRounded";
import miniLogoAdmin from "../../assets/miniLogoAdmin.svg";
import styles from "../../css/header/Header.module.css";

const menuItems = [
    { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/admin/" },
    { text: "Products", icon: <Inventory2RoundedIcon />, path: "/admin/product" },
    { text: "Orders", icon: <ContentPasteRoundedIcon />, path: "/admin/order" },
    { text: "Employees", icon: <PersonOutlineRoundedIcon />, path: "/admin/employee" },
    { text: "Logs", icon: <ContentPasteSearchRoundedIcon />, path: "/admin/log" },
];

const AdminNavigation = ({ open, onClose, onLogoClick }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const currentIndex = menuItems.findIndex(item => item.path === currentPath);
        setSelectedIndex(currentIndex !== -1 ? currentIndex : 0);
    }, [location.pathname]);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        onClose();
        navigate(menuItems[index].path);
    };

    const isSelected = (index) => selectedIndex === index;

    return (
        <Drawer open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>

                </Box>
                <List component="nav" aria-label="main mailbox folders" sx={{ marginTop: "24" }}>
                    {menuItems.map((item, index) => (
                        <ListItemButton
                            key={item.text}
                            selected={isSelected(index)}
                            onClick={(event) => handleListItemClick(event, index)}
                        >
                            <ListItemIcon sx={{ color: isSelected(index) ? "#0E9EFF" : "#4A4A4A" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ color: isSelected(index) ? "#0E9EFF" : "#4A4A4A" }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default AdminNavigation;