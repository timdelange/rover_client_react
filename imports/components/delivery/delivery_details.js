import React, { Component } from 'react';
import { deepGet } from "../../../../imports/utils";
import { connect } from 'react-redux';
import moment from 'moment';
import {
  sceneChange,
  deliveryCustomerOrderSelect
} from '../../actions'


function formatDate(t) {
  let result = "";
  if (parseInt(t) > 0) {
    const dateObj = new Date(t * 1000);
    result =  dateObj.toDateString();
  }
  return result;
}

class DeliveryDetails extends Component {

  selectOrder(index) {
   this.props.deliveryCustomerOrderSelect(index);
   this.props.sceneChange('customer_order')
  }

  renderOrderList(d) {
    let orders = d('customer_orders')||[];
    return orders.map((order,index) => {
      const o = (spec) => { return deepGet(order,spec); };
      return (
          <tr onClick={() => {this.selectOrder(index)}} className="backwhite width100perc listborder" key={index}>
            <td>{o('entityform_id')}</td>
            <td>
              <div className="order-list-date">{moment(parseInt(o('created'))*1000).format('YYYY-MM-DD')}</div>
              <div className="order-list-date">{moment(parseInt(o('delivery_date'))*1000).format('YYYY-MM-DD')}</div>
            </td>
            <td>{o('customer.address.name_line') || o('customer.users_name')}</td>
            <td>{o('customer_order_no')}</td>
            <td className="order-glyph">
              <div className="glyphicon glyphicon-chevron-right" aria-hidden="true"> </div>
            </td>
          </tr>
      )
    })
  }
  render() {
    const delivery = this.props.data;
    const d = (spec) => {
      return deepGet(delivery, spec)
    };
    const order = d('original_order');
    //d('original_order.created')
    return (
        <div>
          <div>
            {/*ng-show="currentTab == 'summary'" className="panel panel-default"*/}
            <div className="panel-heading text-center">
              <div className="panel-title doc-num-title">
                <strong>Delivery:</strong> #{d('sales_order_number')}</div>
            </div>
            <div className="panel-body">
              <dl className="dl-horizontal">
                <dt>Supplier Ref</dt>
                <dd>{d('supplier_reference_number')}</dd>
                <dt>Deliver By</dt>
                <dd>{formatDate(d('planned_delivery_date'))}</dd>
                <dt>&nbsp;</dt>
                <dd>&nbsp;</dd>
                <dt>Collect From</dt>
                <dd>{d('depot.name')}</dd>
                <dd>{d('depot.address.thoroughfare')}</dd>
                <dd>{d('depot.address.locality')}</dd>
                <dd>{d('depot.address.postal_code')}</dd>
                <dt>&nbsp;</dt>
                <dd>&nbsp;</dd>

              </dl>
            </div>
            <div className="panel-heading text-center">
              <div className="panel-title doc-num-title">
                <strong>Orders:</strong></div>
            </div>
            <div className="container xpanel-body">
              <div className="text-center container">
              <table className="width100perc table">
                <tbody className="tdl-list-table-body">
                {this.renderOrderList(d)}
                </tbody>
              </table>
              </div>
            </div>
          </div>
          <br/>
        </div>
    )
  }
}
const mapStateToProps = (state) => {
  // const { auth } = state;
  // const { loggedIn } = auth;
   return {};
};

const actions = {
  sceneChange,
  deliveryCustomerOrderSelect
};

const reduxHOC =  connect(mapStateToProps, actions);
export default reduxHOC(DeliveryDetails);
