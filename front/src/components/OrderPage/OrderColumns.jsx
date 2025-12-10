import {useEffect, useState} from "react";
import {MenuItem} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useDeleteOrder from "../../Hooks/Orders/useDeleteOrder.jsx";
import axiosInstance from "../../config/axiosConfig.js";
import {useGetCategery} from "../../Hooks/Products/useCategory.js";
import {useGetColorsAndSizes} from "../../Hooks/Orders/useGetColorsAndSizes.jsx";
import {useGetProducts} from "../../Hooks/Client/useProduct.js";

const OrderColumns = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    /*{
    "id": 3,
    "client_id": 3,
    "status": "pending",
    "total_price": 3200,
    "isDeleted": 0,
    "created_at": "2024-07-19 14:25:50",
    "updated_at": "2024-07-19 14:25:51",
    "first_name": "mohamed",
    "last_name": "amine",
    "phone_1": "0656215778",
    "phone_2": "0872716672",
    "wilaya": "Alger",
    "common": "Alger Centre",
    "adress": "Address 2",
    "product_orders": [
        {
            "product_id": 1,
            "size_id": 1,
            "product_color_id": 1,
            "quantity": 1,
            "totalPriceOrderProduct": 1600,
            "product_name": "Prod One",
            "description": "ededs zefef",
            "product_price": 1600,
            "CategoryName": "One",
            "color_name": "Blue",
            "size": "S"
        },
        {
            "product_id": 1,
            "size_id": 2,
            "product_color_id": 2,
            "quantity": 1,
            "totalPriceOrderProduct": 1600,
            "product_name": "Prod One",
            "description": "ededs zefef",
            "product_price": 1600,
            "CategoryName": "One",
            "color_name": "Green",
            "size": "M"
        }
    ]
}*/
    const [orderData, setOrderData] = useState({
        id: 0,
        client_id: 0,
        status: 'pending',
        total_price: 0,
        isDeleted: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        first_name: '',
        last_name: '',
        phone_1: '',
        phone_2: '',
        wilaya: '',
        common: '',
        adress: '',
        //flag: '',
        product_orders: [{
            id: 0,
            product_id: 0,
            size_id: 0,
            product_color_id: 0,
            quantity: 0,
            totalPriceOrderProduct: 0,
            product_name: '',
            description: '',
            product_price: 0,
            CategoryName: '',
            color_name: '',
            size: '',
            flag: 'normal',
        }],
    });
    const [id, setId] = useState(null);

    const {handleConfirmDelete, isLoading: deleteLoading, error: deleteError} = useDeleteOrder();

    const [products, setProducts] = useState([]);
    const {data: productsData, isLoading: productsLoading, isError: productsError} = useGetProducts('all', 1);

    const columns = [
        // Define columns as before
        {
            field: "id",
            headerName: "ID",
            width: 200,
            renderCell: (params) => (
                <span style={{color: 'blue'}}>
                    # {params.value}
                </span>
            ),
        },
        {
            field: "first_name",
            headerName: "Prénom",
            width: 200,
        },
        {
            field: "last_name",
            headerName: "Nom",
            width: 200,
        },
        {
            field: "wilaya",
            headerName: "Wilaya",
            width: 200,
        },
        {
            field: "total_price",
            headerName: "Prix",
            width: 200,
            renderCell: (params) => (
                <span style={{fontWeight: 'bold'}}>
                    {params.value} DZD
                </span>
            ),
        },
        {
            field: "status",
            headerName: "État",
            width: 200,
            renderCell: (params) => {
                let color;
                let backgroundColor;

                switch (params.value) {
                    case 'cancelled':
                        color = 'red';
                        backgroundColor = '#ffcccc'; // Light red background for "Pending"
                        break;
                    case 'confirmed':
                        color = 'green';
                        backgroundColor = '#ccffcc'; // Light green background for "Delivered"
                        break;
                    case 'pending':
                        color = 'blue';
                        backgroundColor = '#cce5ff'; // Light blue background for "Processing"
                        break;
                    default:
                        color = 'black';
                        backgroundColor = 'transparent'; // Default black text and transparent background
                }

                return (
                    <span style={{
                        color: color,
                        backgroundColor: backgroundColor,
                        padding: '5px 10px',
                        borderRadius: '5px',
                        display: 'inline'
                    }}>
                        {params.value === 'cancelled' ? (
                            "Annulé"
                        ) : params.value === 'confirmed' ? (
                            "Confirmé"
                        ) : params.value === 'pending' ? (
                            "En attente"
                        ) : (
                            params.value
                        )}
                    </span>
                );
            },
        },
        /*{
            field: "created_at",
            headerName: "Créé à",
            width: 200,
            renderCell: (params) => (<>
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
        },*/
        {
            field: "updated_at",
            headerName: "Mis à jour à",
            width: 200,
            renderCell: (params) => (<>
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
            field: "isDeleted",
            headerName: "Supprimé",
            width: 200,
            renderCell: (params) => (
                <span style={{color: params.value ? 'red' : 'green', fontWeight: "bold", fontSize: "medium"}}>
                    {params.value ? 'Oui' : 'Non'}
                </span>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <MenuItem onClick={() => handleEdit(params.id)}>
                        <EditIcon sx={{color: "blue"}}/>
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(params.id)}>
                        <DeleteIcon sx={{color: "red"}}/>
                    </MenuItem>
                </div>
            ),
        },
    ];

    const [citiesData, setCitiesData] = useState([]);
    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [selectedWilaya, setSelectedWilaya] = useState(orderData?.wilaya || '');
    const [selectedCommune, setSelectedCommune] = useState(orderData?.common || '');
    const [count, setCount] = useState(0);

    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(orderData[0]?.CategoryName || '');
    const [countCategory, setCountCategory] = useState(0);
    const {data: categoriesData, isLoading, isError} = useGetCategery();
    const [selectedColor, setSelectedColor] = useState(orderData[0]?.color_name || '');
    const [selectedSize, setSelectedSize] = useState(orderData[0]?.size || '');
    const [countColor, setCountColor] = useState(0);
    const [countSize, setCountSize] = useState(0);
    const [colorsAndSizes, setColorsAndSizes] = useState([]);
    const {
        data: colorsAndSizesData,
        isLoading: colorsAndSizesLoading,
        isError: colorsAndSizesError
    } = useGetColorsAndSizes();

    useEffect(() => {
        setColorsAndSizes(colorsAndSizesData);
    }, [colorsAndSizesData]);

    useEffect(() => {
        if (productsData) {
            setProducts(productsData.data || []);
        } else if (isError) {
            console.log('Error fetching products');
        }
    }, [productsData, productsError]);

    const handleEdit = async (selectedOrder) => {
        console.log(`Editing order with ID ${selectedOrder}`);
        setId(selectedOrder);

        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get(`api/order/${selectedOrder}`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            const orderDetails = response.data;
            if (!orderDetails) {
                throw new Error("No order details found");
            }

            // Process order details
            const processedOrderDetails = {
                ...orderDetails,
                order_id: orderDetails.id,
                product_orders: orderDetails.product_orders.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    flag: 'normal'
                }))
            };

            setOrderData(processedOrderDetails);
            console.log("Processed order details:", processedOrderDetails);

            // Update wilaya and commune
            setSelectedWilaya(orderDetails.wilaya);
            const filteredCommunes = citiesData
                .filter(item => item.wilaya_name_ascii === orderDetails.wilaya)
                .map(item => item.commune_name_ascii);
            setCommunes(filteredCommunes);
            setSelectedCommune(orderDetails.common);

            setOpenEdit(true);
        } catch (error) {
            console.error("Failed to fetch or process order details:", error.message);
            // Here you could add a user-facing error notification
        }
    };

    const handleDelete = (selectedOrder) => {
        setId(selectedOrder);
        setOpenDelete(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    const handleSaveEdit = () => {
        console.log("handleSaveEdit() --> orderData", orderData)
        // Your save logic here
        setOpenEdit(false);
        // update the order details in the database
        // Optionally, refresh the list of orders or navigate the user away
        const token = localStorage.getItem("token");
        axiosInstance.patch(`api/UpdateClientOrder/`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Order updated successfully", response);
                // Optionally, refresh the list of orders or navigate the user away
            })
            .catch(error => {
                console.error("Failed to update order", error);
                // Optionally, inform the user of the failure
                console.log("error1", error.response)
                console.log("error2", error.response.data)
                console.log("error3", error.response.data.message)
                console.log("orderData", orderData)
            });
    };

    const handleDeleteConfirmed = () => {
        handleConfirmDelete(id);
        setOpenDelete(false);
    };

    const handleWilayaChange = (event) => {
        const selected = event.target.value;
        setSelectedWilaya(selected);
        const filteredCommunes = citiesData
            .filter(item => item.wilaya_name_ascii === selected)
            .map(item => item.commune_name_ascii);
        setCommunes(filteredCommunes);
        setSelectedCommune(''); // Reset selected common when wilaya changes
        handleOrderDataChange(0, 'wilaya', selected);
    };

    const handleCommuneChange = (event) => {
        const selected = event.target.value;
        setSelectedCommune(selected);
        handleOrderDataChange(0, 'common', selected);
    };

    const handleCategoryChange = (event) => {
        const selected = event.target.value;
        setSelectedCategory(selected);
        handleOrderDataChange(0, 'CategoryName', selected);
    }

    const handleColorChange = (event) => {
        const selected = event.target.value;
        setSelectedColor(selected);
        handleOrderDataChange(0, 'color_name', selected);
    }

    const handleSizeChange = (event) => {
        const selected = event.target.value;
        setSelectedSize(selected);
        handleOrderDataChange(0, 'size', selected);
    }

    const handleOrderDataChange = (index, key, value) => {
        setOrderData((prevState) => {
            const updatedOrderData = {...prevState};

            // Update nested product_orders
            if (key in prevState.product_orders[0]) {
                const updatedProductOrders = [...prevState.product_orders];
                updatedProductOrders[index] = {
                    ...updatedProductOrders[index],
                    [key]: value,
                };

                if (key === 'quantity' || key === 'product_price') {
                    updatedProductOrders[index].totalPriceOrderProduct = updatedProductOrders[index].quantity * updatedProductOrders[index].product_price;
                }

                const totalPrice = updatedProductOrders.reduce((acc, item) => acc + item.totalPriceOrderProduct, 0);

                updatedOrderData.product_orders = updatedProductOrders;
                updatedOrderData.total_price = totalPrice;
            } else {
                // Update top-level fields
                updatedOrderData[key] = value;
            }

            updatedOrderData.order_id = prevState.id
            // Ensure the flag is set to 'update'
            //updatedOrderData.flag = 'update';

            console.log("Updated order data", updatedOrderData);

            return updatedOrderData;
        });
    };

    /*const handleOrderDataChange = (index, key, value) => {
        const updatedOrderData = [...orderData];
        updatedOrderData[index][key] = value;
        if (key === 'quantity' || key === 'product_price') {
            updatedOrderData[index].totalPriceOrderProduct = updatedOrderData[index].quantity * updatedOrderData[index].product_price;
            // update total price of the order
            const totalPrice = updatedOrderData.reduce((acc, item) => acc + item.totalPriceOrderProduct, 0);
            updatedOrderData.map(item => item.total_price = totalPrice)
        }
        if (key === 'status' || key === 'first_name' || key === 'last_name' ||
            key === 'phone_1' || key === 'phone_2' || key === 'address' ||
            key === 'wilaya' || key === 'common' || key === 'total_price') {
            updatedOrderData.map(item => item[key] = value)
        }
        setOrderData(updatedOrderData);
    };*/

    /*const handleOrderDataChange = (id, key, value) => {
        const updatedOrderData = orderData.map(item => {
            if (item.id === id) {
                const updatedItem = {...item, [key]: value};
                if (key === 'quantity' || key === 'product_price') {
                    updatedItem.totalPriceOrderProduct = updatedItem.quantity * updatedItem.product_price;
                }
                return updatedItem;
            }
            return item;
        });

        // update total price of the order
        const totalPrice = updatedOrderData.reduce((acc, item) => acc + item.totalPriceOrderProduct, 0);
        updatedOrderData.forEach(item => {
            if (key === 'status' || key === 'first_name' || key === 'last_name' ||
                key === 'phone_1' || key === 'phone_2' || key === 'address' ||
                key === 'wilaya' || key === 'common' || key === 'total_price') {
                item[key] = value;
            }
            item.total_price = totalPrice;
        });

        setOrderData(updatedOrderData);
    };*/

    const handleNumericChange = (id, key, value) => {
        if (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) {
            handleOrderDataChange(id, key, value);
        }
    };

    const handleIntegerChange = (id, key, value) => {
        if (/^\d*$/.test(value) && parseInt(value) > 0) {
            handleOrderDataChange(id, key, value);
        }
    };

    return {
        columns,
        openEdit,
        openDelete,
        orderData,
        setOrderData,
        citiesData,
        setCitiesData,
        wilayas,
        setWilayas,
        communes,
        setCommunes,
        selectedWilaya,
        setSelectedWilaya,
        selectedCommune,
        setSelectedCommune,
        count,
        setCount,
        error,
        setError,
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        countCategory,
        setCountCategory,
        categoriesData,
        isLoading,
        isError,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        countColor,
        setCountColor,
        countSize,
        setCountSize,
        colorsAndSizes,
        setColorsAndSizes,
        colorsAndSizesData,
        colorsAndSizesLoading,
        colorsAndSizesError,
        handleEditClose,
        handleDeleteClose,
        handleSaveEdit,
        handleDeleteConfirmed,
        handleWilayaChange,
        handleCommuneChange,
        handleCategoryChange,
        handleColorChange,
        handleSizeChange,
        handleOrderDataChange,
        handleNumericChange,
        handleIntegerChange,
        products,
    };
};

export default OrderColumns;
