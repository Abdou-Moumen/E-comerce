import PropTypes from 'prop-types';
import {DataGrid} from "@mui/x-data-grid";
import OrderColumns from "./OrderColumns.jsx";
import {useState, useEffect} from "react";
import data from '../../assets/algeria_cities.json';
import OrderDeleteDialog from "./OrderDeleteDialog.jsx";
import OrderEditDialog from "./orderEditDialog.jsx";
import {useGetOrders} from "../../Hooks/Orders/useGetOrders.jsx";

const OrderList = ({searchQuery, setLength}) => {
    const {
        columns,
        openEdit,
        openDelete,
        orderData,
        setOrderData,
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
        setError,
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        countCategory,
        setCountCategory,
        categoriesData,
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
    } = OrderColumns();

    const [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});

    const {data: orders, error, isLoading, refetch} = useGetOrders(searchQuery, paginationModel.page + 1);

    useEffect(() => {
        if (orders) {
            setRows(orders.data || []);
            if (orders.data.length !== 0){
                setTotalRows(orders.data.length);
                setLength(orders.data.length);
            }
            /*if (orders.total_rows !== 0 || orders.data.length === 0) {
                setTotalRows(orders.total_rows);
                setLength(orders.total_rows);
            }*/
        }
    }, [orders]);

    useEffect(() => {
        console.log("Searched Data Order List ", searchQuery)
        refetch().then(r => console.log("Data  dfd:", r))
    }, [searchQuery, paginationModel.page, refetch]);

    useEffect(() => {
        if (isError) {
            setError("An error occurred while fetching categories");
        } else if (categoriesData) {
            setCategories(categoriesData.data || []);
        } else {
            setCategories([]);
        }
    }, [isError, categoriesData]);

    useEffect(() => {
        setCitiesData(data);  // Assuming data is an array of city objects
        const uniqueWilayas = [...new Set(data.map(item => item.wilaya_name_ascii))];
        setWilayas(uniqueWilayas);
    }, []);

    useEffect(() => {
        if (count > 0) return;
        if (orderData[0]?.wilaya) {
            setSelectedWilaya(orderData[0].wilaya);
            const filteredCommunes = data
                .filter(item => item.wilaya_name_ascii === orderData[0].wilaya)
                .map(item => item.commune_name_ascii);
            setCommunes(filteredCommunes);
            if (orderData[0]?.common) {
                setSelectedCommune(orderData[0].common);
                setCount(count + 1);
            }
        }
    }, [orderData]);

    useEffect(() => {
        if (countCategory > 0) return;
        if (orderData[0]?.CategoryName) {
            setSelectedCategory(orderData[0].CategoryName);
            setCountCategory(countCategory + 1);
        }
    }, [orderData]);

    useEffect(() => {
        if (countColor > 0) return;
        if (orderData[0]?.color_name) {
            setSelectedColor(orderData[0].color_name);
            setCountColor(countColor + 1);
        }
    }, [orderData]);

    useEffect(() => {
        if (countSize > 0) return;
        if (orderData[0]?.size) {
            setSelectedSize(orderData[0].size);
            setCountSize(countSize + 1);
        }
    }, [orderData]);

    const handlePaginationModelChange = (newModel) => {
        setPaginationModel(newModel);
    }

    return (
        <div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                onPaginationModelChange={handlePaginationModelChange}
                sx={{height: 650, width: "100%"}}
                loading={isLoading}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                pageSizeOptions={[10]}
                rowCount={totalRows}
                paginationMode="server"
            />
            {/* Edit Dialog */}
            <OrderEditDialog openEdit={openEdit} handleEditClose={handleEditClose} orderData={orderData}
                             selectedWilaya={selectedWilaya} selectedCommune={selectedCommune}
                             wilayas={wilayas} communes={communes} handleWilayaChange={handleWilayaChange}
                             handleCommuneChange={handleCommuneChange} selectedCategory={selectedCategory}
                             categories={categories} handleCategoryChange={handleCategoryChange}
                             selectedColor={selectedColor} selectedSize={selectedSize} setOrderData={setOrderData}
                             colorsAndSizes={colorsAndSizes} setColorsAndSizes={setColorsAndSizes}
                             colorsAndSizesData={colorsAndSizesData}
                             handleColorChange={handleColorChange} handleSizeChange={handleSizeChange}
                             handleOrderDataChange={handleOrderDataChange} handleNumericChange={handleNumericChange}
                             handleIntegerChange={handleIntegerChange} handleSaveEdit={handleSaveEdit}
                             products={products}/>
            {/* Delete Confirmation Dialog */}
            <OrderDeleteDialog
                openDelete={openDelete} handleDeleteClose={handleDeleteClose}
                handleDeleteConfirmed={handleDeleteConfirmed}/>
        </div>
    );
};

OrderList.propTypes = {
    searchQuery: PropTypes.object.isRequired,
    setLength: PropTypes.func.isRequired,
}

export default OrderList;
