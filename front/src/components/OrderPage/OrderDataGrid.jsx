import {useState, useEffect} from 'react';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Alert,
    ThemeProvider,
    createTheme,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {useGetProductDetailsClient} from "../../Hooks/Client/useGetProductDetailsClient.jsx";
import {styled} from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({theme}) => ({
    '&.MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

const ColorChip = styled(Chip)(({theme}) => ({
    margin: theme.spacing(0.5),
    fontWeight: 'bold',
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        background: {
            default: '#ffffff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                },
                columnHeaders: {
                    backgroundColor: '#f5f5f5',
                },
                row: {
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
    },
});

function EditToolbar(props) {
    const {setOrderData, setRowModesModel} = props;

    const handleClick = () => {
        const id = Date.now().toString();
        const newProduct = {
            id: id,
            product_id: 0,
            size_id: 0,
            product_color_id: 0,
            size: '',
            color_name: '',
            quantity: 1,
            totalPriceOrderProduct: 0,
            product_name: '',
            description: '',
            product_price: 0,
            CategoryName: '',
            flag: 'new',
            isNew: true
        };
        setOrderData(prevData => ({
            ...prevData,
            product_orders: [...prevData.product_orders, newProduct],
        }));
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'product_name'},
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon/>}
                onClick={handleClick}
            >
                Ajouter un produit
            </Button>
        </GridToolbarContainer>
    );
}

const OrderDataGrid = ({
                           orderData, setOrderData, colorsAndSizesData,
                           colorsAndSizes, setColorsAndSizes, products
                       }) => {
    const [rowModesModel, setRowModesModel] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [editedRowId, setEditedRowId] = useState(null);

    const {data: productDetails, isLoading, error} = useGetProductDetailsClient(selectedProductId);

    useEffect(() => {
    if (productDetails) {
        const { quantities } = productDetails.data;

        const colors = [...new Set(quantities.map(q => JSON.stringify(q.color)))];
        const sizes = [...new Set(quantities.map(q => JSON.stringify(q.size)))];

        setColorsAndSizes(prevData => ({
            ...prevData,
            colors: colors.map(colorString => {
                const { id, label } = JSON.parse(colorString);
                return { id, value: label };
            }),
            sizes: sizes.map(sizeString => {
                const { id, label } = JSON.parse(sizeString);
                return { id, value: label };
            })
        }));
    }
}, [productDetails, setColorsAndSizes, editedRowId, selectedProductId]);

    const handleProductChange = (params, event) => {
        const selectedProduct = products.find(p => p.product_name === event.target.value);
        if (selectedProduct) {
            params.api.setEditCellValue({id: params.id, field: 'product_name', value: selectedProduct.product_name});
            params.api.setEditCellValue({id: params.id, field: 'CategoryName', value: selectedProduct.CategoryName});
            params.api.setEditCellValue({id: params.id, field: 'product_price', value: selectedProduct.price});
            params.api.setEditCellValue({id: params.id, field: 'product_id', value: selectedProduct.id});

            // Reset color and size for the current row
            params.api.setEditCellValue({id: params.id, field: 'color_name', value: ''});
            params.api.setEditCellValue({id: params.id, field: 'size', value: ''});
            params.api.setEditCellValue({id: params.id, field: 'quantity', value: 0});

            // Set the selected product ID to trigger the query
            setSelectedProductId(selectedProduct.id);
            console.log("product_id ", selectedProduct.id)
            console.log("product_id2 ", params)
            console.log("product_id3 ", params.id)
            setEditedRowId(params.id);
        }
    };

    useEffect(() => {
        console.log(orderData);
    }, [orderData]);

    const calculateTotalPrice = (productOrders) => {
        return productOrders.reduce((acc, item) =>
            item.flag !== 'delete' ? acc + item.totalPriceOrderProduct : acc, 0
        );
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setEditedRowId(id);
        setSelectedProductId(orderData.product_orders.find(row => row.id === id).product_id);
        console.log("set selected product id ", orderData.product_orders.find(row => row.id === id).product_id);
        console.log("edit", id)
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
        setEditedRowId(null);
    };

    const handleDeleteClick = (id) => () => {
        setOrderData(prevData => {
            const updatedProductOrders = prevData.product_orders.map(row =>
                row.id === id ? {...row, flag: 'delete'} : row
            );
            const newTotalPrice = calculateTotalPrice(updatedProductOrders);
            return {
                ...prevData,
                product_orders: updatedProductOrders,
                total_price: newTotalPrice
            };
        });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });
        setEditedRowId(null);

        const editedRow = orderData.product_orders.find((row) => row.id === id);
        if (editedRow.isNew) {
            setOrderData(prevData => ({
                ...prevData,
                product_orders: prevData.product_orders.filter((row) => row.id !== id)
            }));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};
        const errors = {};

        if (!updatedRow.product_name) {
            errors.product_name = 'Le nom du produit est obligatoire';
        }

        if (!updatedRow.color_name) {
            errors.color_name = 'La couleur est obligatoire';
        }

        if (!updatedRow.size) {
            errors.size = 'La taille est requise';
        }

        if (updatedRow.quantity === '' || updatedRow.quantity === null || updatedRow.quantity < 0) {
            errors.quantity = 'La quantité doit être un nombre non négatif';
        }

        if (updatedRow.product_price === '' || updatedRow.product_price === null || updatedRow.product_price < 0) {
            errors.product_price = 'Le prix doit être un nombre non négatif';
        }

        const isDuplicate = orderData.product_orders.some(row =>
            row.id !== updatedRow.id &&
            row.product_name === updatedRow.product_name &&
            row.color_name === updatedRow.color_name &&
            row.size === updatedRow.size &&
            row.flag !== 'delete'
        );

        if (isDuplicate) {
            errors.duplicate = 'Cette combinaison de produit, de couleur et de taille existe déjà';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [updatedRow.id]: errors,
            }));
            setErrorMessage('Veuillez corriger les erreurs');
            return newRow;
        }

        setValidationErrors((prevErrors) => {
            const newErrors = {...prevErrors};
            delete newErrors[updatedRow.id];
            return newErrors;
        });

        setErrorMessage(null);

        updatedRow.totalPriceOrderProduct = updatedRow.quantity * updatedRow.product_price;

        setOrderData(prevData => {
            const updatedProductOrders = prevData.product_orders.map(row =>
                row.id === newRow.id ? updatedRow : row
            );

            updatedProductOrders.forEach(row => {
                const selectedSize = colorsAndSizes.sizes.find(size => size.value === row.size);
                row.size_id = selectedSize ? selectedSize.id : 0;
                console.log("selectedSize ", selectedSize)
                const selectedColor = colorsAndSizes.colors.find(color => color.value === row.color_name);
                row.product_color_id = selectedColor ? selectedColor.id : 0;
                console.log("selectedColor ", selectedColor)
            });

            updatedProductOrders.forEach(row => {
                const selectedProduct = products.find(product => product.product_name === row.product_name);
                row.product_id = selectedProduct ? selectedProduct.id : 0;
            });

            if (!updatedRow.isNew) {
                if (updatedRow.flag !== 'new') {
                    updatedRow.flag = 'update';
                }
            }

            const newTotalPrice = calculateTotalPrice(updatedProductOrders);

            return {
                ...prevData,
                product_orders: updatedProductOrders,
                total_price: newTotalPrice
            };
        });

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, editable: false},
        {
            field: 'product_name',
            headerName: 'Nom du produit',
            width: 200,
            editable: true,
            renderEditCell: (params) => (
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={params.value || ''}
                        onChange={(event) => handleProductChange(params, event)}
                    >
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <MenuItem key={product.id} value={product.product_name}>
                                    {product.product_name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Products Available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            )
        },
        {field: 'CategoryName', headerName: 'Nom de catégorie', width: 200, editable: true},
        {
            field: 'color_name',
            headerName: 'Couleur',
            width: 200,
            editable: true,
            renderEditCell: (params) => (
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={params.value || ''}
                        onChange={(e) => {
                            params.api.setEditCellValue({id: params.id, field: 'color_name', value: e.target.value});
                            const selectedColor = colorsAndSizes.colors.find(color => color.value === e.target.value);
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'product_color_id',
                                value: selectedColor ? selectedColor.id : 0
                            });
                        }}
                    >
                        {colorsAndSizes && colorsAndSizes.colors.length > 0 ? (
                            colorsAndSizes.colors.map((color) => (
                                <MenuItem key={color.id} value={color.value}>
                                    {color.value}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Colors Available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            )
        },
        {
            field: 'size',
            headerName: 'Taille',
            width: 200,
            editable: true,
            renderEditCell: (params) => (
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={params.value || ''}
                        onChange={(e) => {
                            params.api.setEditCellValue({id: params.id, field: 'size', value: e.target.value});
                            const selectedSize = colorsAndSizes.sizes.find(size => size.value === e.target.value);
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'size_id',
                                value: selectedSize ? selectedSize.id : 0
                            });
                        }}
                    >
                        {colorsAndSizes && colorsAndSizes.sizes.length > 0 ? (
                            colorsAndSizes.sizes.map((size) => (
                                <MenuItem key={size.id} value={size.value}>
                                    {size.value}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Sizes Available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            )
        },
        {
            field: 'quantity',
            headerName: 'Quantité',
            width: 200,
            editable: true,
            type: 'number',
            align: "left",
            headerAlign: "left"
        },
        {
            field: 'product_price',
            headerName: 'Prix',
            width: 200,
            editable: true,
            type: 'number',
            align: "left",
            headerAlign: "left"
        },
        {field: 'totalPriceOrderProduct', headerName: 'Total Price', width: 200, editable: false},
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({id, row}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        onClick={handleEditClick(id)}
                        disabled={row.flag === 'delete'}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        disabled={row.flag === 'delete'}
                    />,
                ];
            },
        },
    ];

    const ProductDetailsTable = () => {
        if (!productDetails || !editedRowId) return null;

        const {quantities} = productDetails.data;

        return (
            <TableContainer elevation={1} sx={{mt: 2, borderRadius: 2, overflow: 'hidden'}}>
                <Table size="small" aria-label="product details table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{backgroundColor: '#1976d2'}}>couleurs</StyledTableCell>
                            <StyledTableCell style={{backgroundColor: '#1976d2'}}>Tailles</StyledTableCell>
                            <StyledTableCell align="right"
                                             style={{backgroundColor: '#1976d2'}}>Quantités</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quantities.map((q, index) => (
                            <StyledTableRow key={index}>
                                <TableCell>
                                    <ColorChip
                                        label={q.color.label}
                                        size="small"
                                        style={{backgroundColor: q.color.label.toLowerCase(), color: '#fff'}}
                                    />
                                </TableCell>
                                <TableCell>{q.size.label}</TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight="bold">
                                        {q.quantity}
                                    </Typography>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{width: '100%', mb: 2}}>
                {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{mb: 2}}>
                        {errorMessage}
                    </Alert>
                )}
                <DataGrid
                    rows={orderData.product_orders}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: {setOrderData, setRowModesModel},
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[10]}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableColumnMenu
                    getRowClassName={(params) =>
                        validationErrors[params.id] ? 'error-row' :
                            params.row.flag === 'delete' ? 'deleted-row' : ''
                    }
                    sx={{
                        '& .error-row': {
                            backgroundColor: '#ffcccb',
                            '&:hover': {
                                backgroundColor: '#ffb3b3',
                            },
                        },
                        '& .deleted-row': {
                            backgroundColor: '#f0f0f0',
                            textDecoration: 'line-through',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        },
                    }}
                />
                {selectedProductId && isLoading && (
                    <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}>
                        <CircularProgress/>
                    </Box>
                )}
                {selectedProductId && error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        Error fetching product details: {error.message}
                    </Alert>
                )}
                {editedRowId && <ProductDetailsTable/>}
            </Box>
        </ThemeProvider>
    );
};

export default OrderDataGrid;