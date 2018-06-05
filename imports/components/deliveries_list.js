import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import DeliveryListItem from './delivery_list_item';
import {
  deliverySelect,
  sceneChange
} from "../actions";

class DeliveriesList extends Component {
  onClick (id) {
    this.props.deliverySelect(id);
    this.props.sceneChange('delivery');
  }

  renderList() {
    //todo: order by changed
    //console.log(this.props.deliveries);
    return this.props.deliveries.map( (data) => {
      return <DeliveryListItem onClick={() => { this.onClick(data._id) }} key={data._id} data={data}/>
    })
  }
  render() {
    return (
      <table className="rtable-hover">
        <tbody>
						<tr className="delivery-list-tr text-center list-group-item">
							<td colSpan={3} className="delivery-list-td">
								<b>Deliveries</b>
							</td>
						</tr>
            {this.renderList()}
        </tbody>
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  const { auth } = state;
  const { loggedIn } = auth;
  return { loggedIn };
};

const actions = {
  sceneChange,
  deliverySelect
}
const reduxHOC =  connect(mapStateToProps, actions);


const meteorHOC =  withTracker(({ search }) => {
  return {
      deliveries:  Deliveries.find({
					"$or": [
						{ sales_order_number: new RegExp(search||"") },
						{ "original_order.customer.address.name_line": new RegExp(search, 'i')},
						{ "original_order.customer.address.name_line": new RegExp(search, 'i')},
						{ "driver_details.name": new RegExp(search, 'i')},
						{ "depot.name": new RegExp(search, 'i')},
					   ]
			},{sort: {changed:-1}}).fetch()
  };
});

export default compose(meteorHOC,reduxHOC)(DeliveriesList);