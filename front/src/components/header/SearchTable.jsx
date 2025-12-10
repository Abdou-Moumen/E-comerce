import React, { useRef } from "react";
import styles from "../css/Chauffeur.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const SearchTable = ({ onSearch, searchQuery, placeHolder }) => {
  const inputRef = useRef(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <>
      <div className={styles.search}>
        {/*<img className={styles.searchIcon} src={searchIcon} alt={"Search"} onClick={focusInput}/>*/}
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <input
          className={styles.searchInput}
          ref={inputRef}
          value={searchQuery}
          onChange={onSearch}
          placeholder={placeHolder}
        />
        <TextField id="select" label="Age" value="20" select>
          <MenuItem value="10">Ten</MenuItem>
          <MenuItem value="20">Twenty</MenuItem>
        </TextField>
      </div>
    </>
  );
};

export default SearchTable;
