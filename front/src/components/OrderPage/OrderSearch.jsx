import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {
    TextField,
    MenuItem,
    Box,
    Button,
    Typography,
    Grid,
    Collapse,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Paper,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import data from "../../assets/algeria_cities.json";

const OrderSearch = ({setSearchQuery}) => {
    const [isOpened, setIsOpened] = useState(false);
    const [citiesData, setCitiesData] = useState([]);
    const [wilayas, setWilayas] = useState([]);
    const {control, handleSubmit, reset} = useForm({
        defaultValues: {
            searchQuery: "",
            selectedStatus: "",
            selectedWilaya: "",
            selectedIsDeleted: "",
        },
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleFilter = () => setIsOpened(!isOpened);

    const onSubmit = (formData) => {
        console.log("Form Data: ", formData);
        setSearchQuery({
            search: formData.searchQuery.trim() === "" ? "" : formData.searchQuery,
            status: formData.selectedStatus,
            wilaya: formData.selectedWilaya,
            isDeleted: formData.selectedIsDeleted,
        });
    };

    const handleReset = () => {
        reset({
            searchQuery: "",
            selectedStatus: "",
            selectedWilaya: "",
            selectedIsDeleted: "",
        });
        setIsOpened(false);
    };

    useEffect(() => {
        setCitiesData(data);  // Assuming data is an array of city objects
        const uniqueWilayas = [...new Set(data.map(item => item.wilaya_name_ascii))];
        setWilayas(uniqueWilayas.map(wilaya => ({key: wilaya, value: wilaya})));
    }, []);

    const stock = [
        {key: "pending", value: "En attente"},
        {key: "confirmed", value: "Confirmé"},
        {key: "cancelled", value: "Annulé"},
    ];

    const deleted = [
        {key: "1", value: "Oui"},
        {key: "0", value: "Non"},
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Box sx={{p: 2.5}}>
                <Typography variant="h6" fontWeight="bold" mb={2.5}>
                    Rechercher des Commandes
                </Typography>
                <Box sx={{display: "flex", gap: 2, flexDirection: isMobile ? "column" : "row"}}>
                    <Controller
                        name="searchQuery"
                        control={control}
                        render={({field}) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="outlined"
                                placeholder="Rechercher des commandes"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action"/>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        height: '48px',
                                    },
                                }}
                            />
                        )}
                    />
                    <Chip
                        icon={<FilterListIcon/>}
                        label={isOpened ? "Masquer les filtres" : "Afficher les filtres"}
                        onClick={toggleFilter}
                        color={isOpened ? "primary" : "default"}
                        variant={isOpened ? "filled" : "outlined"}
                        sx={{
                            borderRadius: 2,
                            height: 48,
                            fontSize: '0.9rem',
                            '& .MuiChip-icon': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                </Box>

                <Collapse in={isOpened}>
                    <Box sx={{mt: 2.5}}>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="selectedStatus"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="État"
                                            select
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    height: '48px',
                                                },
                                            }}
                                        >
                                            {stock.map((option) => (
                                                <MenuItem key={option.key} value={option.key}>
                                                    {option.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="selectedWilaya"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Wilaya"
                                            select
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    height: '48px',
                                                },
                                            }}
                                        >
                                            {wilayas.map((option) => (
                                                <MenuItem key={option.key} value={option.value}>
                                                    {option.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="selectedIsDeleted"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Supprimé"
                                            select
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    height: '48px',
                                                },
                                            }}
                                        >
                                            {deleted.map((option) => (
                                                <MenuItem key={option.key} value={option.key}>
                                                    {option.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    p: 2.5,
                    bgcolor: "grey.100",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                {isOpened && (
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={handleReset}
                        startIcon={<CloseIcon/>}
                        fullWidth={isMobile}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.25,
                            height: '40px',
                        }}
                    >
                        Réinitialiser
                    </Button>
                )}
                <Button
                    variant="solid"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    startIcon={<SearchIcon/>}
                    fullWidth={isMobile}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.25,
                        height: '40px',
                        backgroundColor: "primary",
                    }}
                >
                    Rechercher
                </Button>
            </Box>
        </Paper>
    );
};

OrderSearch.propTypes = {
    setSearchQuery: PropTypes.func.isRequired,
};

export default OrderSearch;
