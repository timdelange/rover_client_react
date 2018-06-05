import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import DeliveryDetails from './delivery/delivery_details';
import { deepGet } from "../../../imports/utils";

class Delivery extends Component {
  render() {
    //console.log(this.props.delivery);
    const delivery = this.props.delivery;
    return (
        <DeliveryDetails data={this.props.delivery} />
		);
  }
}

const mapStateToProps = (state) => {
  const { current_delivery } = state.deliveries;
  const id  =  current_delivery;
  return { id };
};

const reduxHOC = connect(mapStateToProps, {
 });

const meteorHOC =  withTracker(({ id }) => {
  return {
    delivery:  Deliveries.findOne({_id: id })
  };
});
export default compose(reduxHOC, meteorHOC)(Delivery);
