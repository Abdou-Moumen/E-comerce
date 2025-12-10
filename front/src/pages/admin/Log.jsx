import {useNavigate} from "react-router-dom";
import {Box} from "@mui/material";
import Breadcrumb from "../../components/commun/BreadCrumb.jsx";
import LogAction from "../../components/LogPage/LogAction.jsx";
import LogOrderList from "../../components/LogPage/LogOrderList.jsx";
import LogLoginList from "../../components/LogPage/LogLoginList.jsx";
import LogColumns from "../../components/LogPage/LogColumns.jsx";

const Log = () => {
    const navigate = useNavigate();

    const breadcrumb = [
        {name: "Activités", path: "/admin/log"},
        {name: "Activités", path: "/admin/log"},
    ];

    const {
        showOrders,
        setShowOrders,
        showLogin,
        setShowLogin,
        setQuery,
        setPaginationModel,
        statusLogin,
        setStatusLogin,
        userLogin,
        setUserLogin,
        statusOrder,
        setStatusOrder,
        userOrder,
        setUserOrder,
        isLoading,
        rowsAuth,
        rowsOrder,
        uniqueUsers,
        columnsAuth,
        columnsOrder,
        hardcodedLoginAction,
        hardcodedOrderAction,
        handleStatusLoginChange,
        handleUserLoginChange,
        handleStatusOrderChange,
        handleUserOrderChange,
        handleOrderRowItemClick,
        handleLoginRowItemClick,
        handleOrderLogsClick,
        handleLoginLogsClick,
    } = LogColumns();

    return (<>
        <Breadcrumb
            breadcrumb={breadcrumb}
            navigate={navigate}
            PageTitle={"Activités"}
        />
        <Box
            sx={{
                background: "white",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                borderRadius: "8px",
                padding: "20px",
                height: 500,
            }}
        >
            <LogAction setQuery={setQuery} setShowOrders={setShowOrders} setShowLogin={setShowLogin}
                       setStatusLogin={setStatusLogin} setUserLogin={setUserLogin} showLogin={showLogin}
                       setStatusOrder={setStatusOrder} setUserOrder={setUserOrder} showOrders={showOrders}
                       handleLoginLogsClick={handleLoginLogsClick} handleOrderLogsClick={handleOrderLogsClick}/>
            {showOrders && (
                <LogOrderList rowsOrder={rowsOrder} columnsOrder={columnsOrder}
                              handleOrderRowItemClick={handleOrderRowItemClick}
                              setPaginationModel={setPaginationModel} isLoading={isLoading}
                              userOrder={userOrder} statusOrder={statusOrder}
                              handleUserOrderChange={handleUserOrderChange}
                              handleStatusOrderChange={handleStatusOrderChange} orderLength={rowsOrder.length}
                              uniqueUsers={uniqueUsers} hardcodedOrderAction={hardcodedOrderAction}/>
            )}
            {showLogin && (
                <LogLoginList rowsAuth={rowsAuth} columnsAuth={columnsAuth}
                              handleLoginRowItemClick={handleLoginRowItemClick}
                              setPaginationModel={setPaginationModel} isLoading={isLoading}
                              userLogin={userLogin} statusLogin={statusLogin}
                              handleUserLoginChange={handleUserLoginChange}
                              handleStatusLoginChange={handleStatusLoginChange} loginLength={rowsAuth.length}
                              uniqueUsers={uniqueUsers} hardcodedLoginAction={hardcodedLoginAction}/>
            )}
        </Box>
    </>);
};

export default Log;
