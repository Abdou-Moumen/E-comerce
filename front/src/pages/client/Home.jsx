import React, { useState, useEffect } from "react";
import styles from "../../css/client/Client.module.css";
import Header from "../../components/header/Header.jsx";
import { Box } from "@mui/material";
import ProductHolder from "../../components/Client/ProductHolder.jsx";
import Pagination from "../../components/Client/Pagination.jsx";
import LandingText from "../../components/Client/LandingText.jsx";



const Home = () => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const onChange = (event, value) => {
        setPage(value);
    }
    const gradientBackground = "radial-gradient(circle, rgba(255,209,183,1) 0%, rgba(255,243,236,1) 100%)";


    return (<>

        <div className={styles.page}>
            <Box sx={{
                // position: 'relative',
                background: gradientBackground,

            }}>
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        transition: 'background 0.3s ease',
                        background: isScrolled ? 'white' : 'transparent',
                    }}
                >
                    <Header role={"client"} />
                </Box>
                <LandingText />
            </Box>

            <main className={styles.mainContainer}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    gap: "20px",
                }}>


                <ProductHolder
                    setCount={setCount}
                    page={page}
                />
                <Pagination
                    count={count}
                    page={page}
                    onChange={onChange}
                />
            </main>
        </div>
    </>);
};

export default Home;
