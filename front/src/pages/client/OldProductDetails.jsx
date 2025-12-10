import styles from "../../css/client/Client.module.css";
import Header from "../../components/header/Header.jsx";
import backIcon from "../../assets/backIcon.svg";
import downArrow from "../../assets/downArrow.svg";
import upArrow from "../../assets/upArrow.svg";
import shopIcon from "../../assets/shopIcon.svg";
import image1 from "../../assets/image 1.jpg";
import image2 from "../../assets/image 2.jpg";
import {Typography, Box, TextField} from "@mui/material";
import {useState, useEffect} from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuItem from "@mui/material/MenuItem";
import data from '../../assets/algeria_cities.json';

const OldProductDetails = () => {
    // const [data, setData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [selectedWilaya, setSelectedWilaya] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    useEffect(() => {
        setCitiesData(data);  // Assuming data is an array of city objects
        const uniqueWilayas = [...new Set(data.map(item => item.wilaya_name_ascii))];
        setWilayas(uniqueWilayas);
    }, []);

    const handleWilayaChange = (event) => {
        const selected = event.target.value;
        setSelectedWilaya(selected);
        const filteredCommunes = citiesData
            .filter(item => item.wilaya_name_ascii === selected)
            .map(item => item.commune_name_ascii);
        setCommunes(filteredCommunes);
        setSelectedCommune(''); // Reset selected commune when wilaya changes
    };

    const handleCommuneChange = (event) => {
        setSelectedCommune(event.target.value);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    }

    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleOrder = () => {
        navigate("/orderCompleted");
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    return (<>
            <div className={styles.page}>
                <Header role={"client"}/>
                <main className={styles.mainContainer}
                      style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px"}}>
                    <img src={backIcon} alt={"back icon"}
                         style={{cursor: "pointer", marginTop: '12px', marginBottom: '12px'}} onClick={handleGoBack}/>
                    <div style={{width: '88%', margin: '0 auto', paddingTop: '20px'}}>
                        <Slider {...settings}>
                            <div>
                                <img src={image1} alt="image 1" style={{width: '100%', borderRadius: '10px'}}/>
                            </div>
                            <div>
                                <img src={image2} alt="image 2" style={{width: '100%', borderRadius: '10px'}}/>
                            </div>
                        </Slider>
                    </div>
                    <Typography variant="body1" sx={{color: '#3C3C43', fontWeight: 'bold', mb: 1}}>
                        Pack Spécial Fin d&apos;Année: Hachoir Inox + Box Brochettes
                    </Typography>
                    <Typography variant="body1" sx={{color: '#3C3C43', mb: 1}}>
                        Tennis blanches à lacets, avec bande latérale. Bande colorée sur le côté et à l’arrière
                    </Typography>
                    <Typography variant="body1" sx={{color: '#FC6C8D', mb: 1}}>
                        3200 DZD
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{color: '#FC6C8D', textDecoration: 'line-through', ml: 1}}
                        >
                            4900 DZD
                        </Typography>
                    </Typography>
                    <Typography variant="body1" sx={{color: '#3C3C43', fontWeight: 'bold', mb: 1}}>
                        Détails du produit
                    </Typography>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: "20px"
                        }}>
                        <Typography variant="body1" sx={{color: '#3C3C43', fontWeight: 'bold', mb: 1}}>
                            Couleur
                        </Typography>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        marginBottom: '20px',
                        gap: '8px', // This adds 8px margin between the circles
                    }}>
                        <div style={{
                            width: '21px',
                            height: '21px',
                            backgroundColor: '#FFBE0B',
                            borderRadius: '50%',
                            border: '1px solid rgba(182, 182, 182, 0.2)', // Adding the stroke
                        }}/>
                        <div style={{
                            width: '21px',
                            height: '21px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '50%',
                            border: '1px solid rgba(182, 182, 182, 0.2)', // Adding the stroke
                        }}/>
                        <div style={{
                            width: '21px',
                            height: '21px',
                            backgroundColor: '#9747FF',
                            borderRadius: '50%',
                            border: '1px solid rgba(182, 182, 182, 0.2)', // Adding the stroke
                        }}/>
                        <div style={{
                            width: '21px',
                            height: '21px',
                            backgroundColor: '#FC6C8D',
                            borderRadius: '50%',
                            border: '1px solid rgba(182, 182, 182, 0.2)', // Adding the stroke
                        }}/>
                    </div>
                    <Typography variant="body1" sx={{color: '#3C3C43', fontWeight: 'bold', mb: 1}}>
                        Taille
                    </Typography>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        marginTop: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <div
                                    key={size}
                                    onClick={() => handleSizeClick(size)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: selectedSize === size ? '#FC6C8D' : '#FFFFFF',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(182, 182, 182, 0.2)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Typography variant="body1" sx={{
                                        color: selectedSize === size ? '#FFFFFF' : '#3C3C43',
                                        fontWeight: 'bold'
                                    }}>
                                        {size}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Typography variant="body1" sx={{color: '#3C3C43', fontWeight: 'bold', mb: 1}}>
                        Quantité
                    </Typography>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: '12px'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                            <img
                                src={upArrow}
                                alt="up arrow"
                                style={{width: '16px', height: '16px', cursor: 'pointer', margin: 'auto'}}
                                onClick={handleIncreaseQuantity}
                            />
                            <Typography variant="body1"
                                        sx={{color: '#3C3C43', fontWeight: 'bold', textAlign: 'center', width: '100%'}}>
                                {quantity}
                            </Typography>
                            <img
                                src={downArrow}
                                alt="down arrow"
                                style={{width: '16px', height: '16px', cursor: 'pointer', margin: 'auto'}}
                                onClick={handleDecreaseQuantity}
                            />
                        </Box>
                    </div>
                    <div style={{minWidth: '200px', maxWidth: '100%', textAlign: 'left', padding: '20px'}}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            cursor: 'pointer'
                        }} onClick={toggleDetails}>
                            <div>
                                <div style={{fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px'}}>Information
                                    personnelle
                                </div>
                                <div>Remplir cette forme pour commander</div>
                            </div>
                            <img
                                src={downArrow}
                                alt="down arrow"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                onClick={toggleDetails}
                            />
                        </div>
                        {showDetails && (
                            <div
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    marginTop: '10px'
                                }}>
                                <TextField
                                    id="outlined-textarea"
                                    label="Nom et Prénom"
                                    placeholder="Nom et Prénom"
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <LocalOfferIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    id="outlined-textarea"
                                    label="Téléphone 1"
                                    placeholder="Téléphone 1"
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <LocalOfferIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    id="outlined-textarea"
                                    label="Téléphone 2"
                                    placeholder="Téléphone 2"
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <LocalOfferIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    id="outlined-textarea"
                                    label="Adresse"
                                    placeholder="Rue, Batiment..."
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <LocalOfferIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Wilaya"
                                    fullWidth
                                    margin="normal"
                                    value={selectedWilaya}
                                    onChange={handleWilayaChange}
                                    InputProps={{style: {paddingRight: '24px'}}}
                                >
                                    {wilayas.map((wilaya) => (
                                        <MenuItem key={wilaya} value={wilaya}>
                                            {wilaya}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Commune"
                                    fullWidth
                                    margin="normal"
                                    value={selectedCommune}
                                    onChange={handleCommuneChange}
                                    InputProps={{style: {paddingRight: '24px'}}}
                                >
                                    {communes.map((commune) => (
                                        <MenuItem key={commune} value={commune}>
                                            {commune}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <div style={{
                                    marginTop: '20px',
                                    padding: '16px',
                                    backgroundColor: '#FEDAE3',
                                    borderRadius: '6px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px'
                                    }}>
                                        <div>PRODUIT :</div>
                                        <div style={{fontWeight: 'bold'}}>3900.00 DZD</div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px'
                                    }}>
                                        <div>Livraison :</div>
                                        <div style={{fontWeight: 'bold'}}>600.00 DZD</div>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>Total à payer :</div>
                                        <div style={{color: '#FC6C8D', fontWeight: 'bold'}}>4500.00 DZD</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                            marginTop: '12px',
                            borderTop: '1px solid #FC6C8D',
                        }}>
                            <Button
                                variant="contained"
                                startIcon={<img src={shopIcon} alt={"show icon"}/>}
                                onClick={handleOrder}
                                sx={{
                                    backgroundColor: "#FC6C8D",
                                    color: "white",
                                    fontWeight: "600",
                                    marginTop: '12px',
                                    '&:hover': {
                                        backgroundColor: "#FC6C8D",
                                    },
                                    '&:active': {
                                        backgroundColor: "#FC6C8D",
                                    },
                                    '&:focus': {
                                        backgroundColor: "#FC6C8D",
                                    },
                                }}
                            >
                                Commander
                            </Button>
                        </Box>
                    </div>
                </main>
            </div>
        </>
    );
}

export default OldProductDetails;