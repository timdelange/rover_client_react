import React, { Component } from 'react';
import { deepGet } from "../../../imports/utils";
import { withTracker } from 'meteor/react-meteor-data';
import delivery from "./delivery";

class DeliveryListItem extends Component {

	renderCustomerNames() {
		const max = this.props.data.customer_orders.length;
		const sep = (index )=>{ if (index < max -1) return <strong>|</strong>};
		return this.props.data.customer_orders.map((order, index) => {
			const orgName = deepGet(order, 'customer.address.organisation_name');
		  if (_.isEmpty(orgName)) return (<span key={index}>&nbsp;</span>);
			else return (<span key={index}><span className="delivery-list-org-name">{orgName}</span>{sep(index)}</span>);
		});
  }


  render() {
    const delivery = this.props.data;
    //console.log(delivery);
    const userName = this.props.userName;
    const collectionDocs = deepGet(delivery,'documents.collection') || [{finalized: false}] ;
    const collected = collectionDocs[0].finalized;
    return (
						<tr className="list-group-item width100perc">
							<td className="order-detail">
								<div onClick={this.props.onClick} >
									<div className="container-fluid zeropadding">
										<div className="row">
											<div className="col-xs-12 col-sm-5 col-md-4 deliveries-num-col">#<small><b>{delivery.sales_order_number}</b></small></div>
											<div className="col-xs-12 col-sm-7 col-md-8 deliveries-depot-col">{delivery.depot.name}</div>
											<div className="col-xs-12 col-sm-12 col-md-6 deliveries-dest-col">{this.renderCustomerNames()}</div>
										</div>
										{ (userName == 'admin' )  &&
                        <div>
                          <div className="glyphicon glyphicon-user"></div> {deepGet(delivery,'driver_details.name')}
                        </div>
										}
                    { delivery.imagesArchived &&
											<div className="pull-right">
												<small><em>archived</em></small>
											</div>
                    }
									</div>
								</div>
							</td>
							<td className="order-ticks">
                { collected &&
									<span className="soft glyphicon glyphicon-ok"></span>
                }
                { delivery.finalized &&
								  <span className="soft glyphicon glyphicon-ok"></span>
                }
							</td>
							<td className="order-glyph">
								 <div className="glyphicon glyphicon-chevron-right" aria-hidden="true"> </div>
							</td>
						</tr>
		);
  }
}
const meteorHOC =  withTracker(({ search }) => {
  return { userName : deepGet(Meteor.user(), 'username')};
});
export default meteorHOC(DeliveryListItem);
