import {useMemo, useState, useEffect, useRef} from "react";
import {useGetLogs} from "../../Hooks/Logs/useGetLogs.jsx";

const LogColumns = () => {

    const [showOrders, setShowOrders] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    const [query, setQuery] = useState({first_name: "", last_name: "", login_action: "", order_action:""});
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});

    const [statusLogin, setStatusLogin] = useState("");
    const [userLogin, setUserLogin] = useState();
    const [statusOrder, setStatusOrder] = useState("");
    const [userOrder, setUserOrder] = useState();

    const {data: logsData, error, isLoading} = useGetLogs(query, paginationModel.page + 1);

    const processData = (data, type) => {
        return data.map(item => ({
            ...item,
            full_name: `${item.first_name} ${item.last_name}`,
        }));
    };

    const rowsAuth = error ? processData([], 'Auth Logs') : processData(logsData?.["Auth Logs"] || [], 'Auth Logs');
    const rowsOrder = error ? processData([], 'Orders Logs') : processData(logsData?.["Orders Logs"] || [], 'Orders Logs');

    const [uniqueUsers, setUniqueUsers] = useState([]);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current) {
            const users = new Map();
            [...rowsAuth, ...rowsOrder].forEach(log => {
                const {user_id, first_name, last_name} = log;
                if (user_id && !users.has(user_id)) {
                    users.set(user_id, {fullName: `${first_name} ${last_name}`, first_name, last_name});
                }
            });
            setUniqueUsers(Array.from(users, ([key, value]) => ({key, ...value})));
            if (rowsAuth.length > 0 || rowsOrder.length > 0) {
                isInitialized.current = true;
            }
        }
    }, [rowsAuth, rowsOrder]);

    /*const uniqueUsers = useMemo(() => {
        const users = new Map();
        [...rowsAuth, ...rowsOrder].forEach(log => {
            const {user_id, first_name, last_name} = log;
            if (user_id && !users.has(user_id)) {
                users.set(user_id, {fullName: `${first_name} ${last_name}`, first_name, last_name});
            }
        });
        return Array.from(users, ([key, value]) => ({key, ...value}));
    }, [rowsAuth, rowsOrder]);*/

    const columnsAuth = [
        {
            field: "id", headerName: "ID", flex: 0.5, renderCell: (params) => (
                <span style={{color: 'blue'}}>
                    # {params.value}
                </span>
            ),
        },
        {field: "full_name", headerName: "Nom d'utilisateur", flex: 1},
        {field: "action", headerName: "Action", flex: 1},
        {
            field: "created_at", headerName: "Créé à", flex: 1, renderCell: (params) => (<>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "15px"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
                <span>, </span>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "small"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false
                    })}
                </span>
            </>),
        },
        {
            field: "updated_at", headerName: "Mis à jour à", flex: 1, renderCell: (params) => (<>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "15px"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
                <span>, </span>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "small"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false
                    })}
                </span>
            </>),
        },
    ];

    const columnsOrder = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5,
            renderCell: (params) => (
                <span style={{color: 'blue'}}>
                    # {params.value}
                </span>
            ),
        },
        {field: "full_name", headerName: "Nom d'utilisateur", flex: 1},
        {
            field: "order_id",
            headerName: "Commande ID",
            flex: 1,
            renderCell: (params) => (
                <span style={{color: 'blue'}}>
                    {params.value}
                </span>
            ),
        },
        {field: "action", headerName: "Action", flex: 1},
        {
            field: "created_at", headerName: "Créé à", flex: 1, renderCell: (params) => (<>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "15px"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
                <span>, </span>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "small"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false
                    })}
                </span>
            </>),
        },
        {
            field: "updated_at", headerName: "Mis à jour à", flex: 1, renderCell: (params) => (<>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "15px"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
                <span>, </span>
                <span style={{color: 'black', fontWeight: 'normal', fontSize: "small"}}>
                    {new Date(params.value).toLocaleString('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false
                    })}
                </span>
            </>),
        },
    ];

    const hardcodedLoginAction = [
        {key: "Login", value: "Login"},
        {key: "Logout", value: "Logout"},
    ];

    const hardcodedOrderAction = [
        {key: "pending", value: "En Attente"},
        {key: "confirmed", value: "Confirmé"},
        {key: "cancelled", value: "Annulé"},
    ];

    /*const hardcodedLoginUser = [
        {key: "mohamed", value: "Mohamed Amine"},
        {key: "nasar", value: "Nasar Ali"},
        {key: "salim", value: "Salim Mounir"},
    ];

    const hardcodedOrderUser = [
        {key: "mohamed", value: "Mohamed Amine"},
        {key: "nasar", value: "Nasar Ali"},
        {key: "salim", value: "Salim Mounir"},
    ];*/

    const handleStatusLoginChange = (event) => {
        setStatusLogin(event.target.value);
        setQuery({...query, login_action: event.target.value})
    };

    const handleUserLoginChange = (event) => {
        setUserLogin(event.target.value);
        // find the user name
        const user = uniqueUsers.find(user => user.key === event.target.value);
        if (user) {
            setQuery({...query, first_name: user.first_name, last_name: user.last_name})
        }
    };

    const handleStatusOrderChange = (event) => {
        setStatusOrder(event.target.value);
        setQuery({...query, order_action: event.target.value})
    };

    const handleUserOrderChange = (event) => {
        setUserOrder(event.target.value);
        setQuery({...query, user_id: event.target.value})
    };

    const handleOrderRowItemClick = (params) => {
        console.log(params.id);
    };

    const handleLoginRowItemClick = (params) => {
        console.log(params.id);
    };

    const handleOrderLogsClick = () => {
        setShowOrders(true);
        setShowLogin(false);
        setQuery({first_name: "", last_name: "", login_action: "", order_action: ""})
        setStatusLogin("")
        setUserLogin(null)
    };

    const handleLoginLogsClick = () => {
        setShowOrders(false);
        setShowLogin(true);
        setQuery({first_name: "", last_name: "", login_action: "",order_action:""})
        setStatusOrder("")
        setUserOrder(null)
    };

    return {
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
    };
}

export default LogColumns;