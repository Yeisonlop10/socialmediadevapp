import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
    // With map we do a "foreach" type and return jsx
    // We need the alert.id becuse we return an id and we style it
    // with className dynamically with the alert type attached to it
    // in this case Danger
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        { alert.msg }
    </div>
));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}
// We are mapping the redux state to a prop in this component
const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);