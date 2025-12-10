import {useState} from "react";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import OrderSearch from "../../../components/OrderPage/OrderSearch.jsx";
import OrderAction from "../../../components/OrderPage/OrderAction.jsx";
import OrderList from "../../../components/OrderPage/OrderList.jsx";
import {useGetOrders} from "../../../Hooks/Orders/useGetOrders";

const Order = () => {
    const navigate = useNavigate();

    const breadcrumb = [
        {name: "Commende", path: "/admin/order"},
        {name: "Commende", path: "/admin/order"},
    ];

    const [length, setLength] = useState(0);
    const [searchQuery, setSearchQuery] = useState({
        search: "",
        status: "",
        wilaya: "",
        isDeleted: "",
    });

    return (<>
        <Breadcrumb breadcrumb={breadcrumb} navigate={navigate} PageTitle={"Commende"}/>
        <OrderSearch setSearchQuery={setSearchQuery}/>
        <Box
            sx={{
                background: "white",
                width: "100%",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <OrderAction length={length}/>
            <OrderList searchQuery={searchQuery} setLength={setLength}/>
        </Box>
    </>);
};

export default Order;
