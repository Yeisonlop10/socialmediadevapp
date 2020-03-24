import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
    return (
        <div>
            
        </div>
    )
}

Alert.propTypes = {

}
// We are mapping the redux state to a prop in this component
const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect()(Alert);