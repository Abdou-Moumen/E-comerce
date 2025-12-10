import PropTypes from 'prop-types';

const OrderAction = ({length}) => {

    return (<>
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
            }}
        >
            <div>
                Il y a <span style={{color: "red"}}>{length}</span> commendes
            </div>
        </div>
    </>);
}

OrderAction.propTypes = {
    length: PropTypes.number,
}

export default OrderAction;