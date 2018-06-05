import React from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { deepGet } from "../../../../imports/utils";
import _ from 'lodash';
import {sceneChange, deliveryDocumentSelect} from "../../actions";
import PODapi from '../../../../imports/api/api_pod'
import moment from 'moment';

const podApi = new PODapi();

function formatDate(t) {
  let result = "";
  if (parseInt(t) > 0) {
    const dateObj = new Date(t * 1000);
    result =  dateObj.toDateString();
  }
  return result;
}


function renderTotals(order) {
  const o = (spec) => { return deepGet(order,spec) };
  const totals = _.map(['di50','di500','ulp','lrp','95ulp'], function (name) {
    return (
      <tr key={name}>
          <td>
            <img className="product-table-icon" src={ 'images/product/' + name + '.png' } />
          </td>
          <td>
             {o('total_' + name)}&nbsp; <em>l</em>
          </td>
      </tr>
    );
  });
  return totals;
}

function renderPODList(props, o) {
  const list = o('documents.POD') || [];
  console.log(list);
  const renderedList = list.map((pod,index)=>(
      <button onClick={()=>{onClickPODItem(props, pod.id)}} key={index} type="button" className="list-group-item">
        #{index} POD <strong>{ pod.arrival_time && moment(pod.arrival_time*1000).format('YYYY/MM/DD') }</strong>
        { pod.finalised &&
        <span className="pull-right soft glyphicon glyphicon-ok"></span>
        }
        { pod.finalised ||
        <span>&nbsp;&nbsp;<em><strong>***Incomplete***</strong></em></span>
        }
      </button>
  ));
  return (
      <div className="list-group">{renderedList}</div>
  );
}

function onClickPODItem(props, key) {
  props.deliveryDocumentSelect(key);
  props.sceneChange('delivery_document_form');
}

function DeliveryCustomerOrder(props) {
  this.onClickCreatePod = () => {

    p.setOrder(props.delivery, props.current_order_index);
    const key = p.addDoc();
    props.deliveryDocumentSelect(key);
    props.sceneChange('delivery_document_form');
  };

  let order = {};
  const customerOrders = deepGet(props,'delivery.customer_orders');
  if (_.isArray(customerOrders))
    order = props.delivery.customer_orders[props.current_order_index]
  else
    return <div>Loading</div>;

  const o = (spec) => { return deepGet(order,spec) };

  return (
      <div>
          <div>
            { /*ng-show="currentTab == 'summary'" className="panel panel-default"*/}
              <div className="panel-heading text-center">
                <div className="panel-title doc-num-title"><strong>Customer Order:</strong> #{ o('entityform_id')}</div>
              </div>
              <div className="panel-body">
                <dl className="dl-horizontal">
                  <dt>Ordered Date</dt>
                  <dd>{ formatDate(o('created')) }</dd>
                  <dt>Please Deliver By</dt>
                  <dd>{ formatDate(o('delivery_date')) }</dd>
                  <dt>&nbsp;</dt>
                  <dd>&nbsp;</dd>
                  <dt>Deliver To</dt>
                  <dd>{o('customer.address.name_line')}</dd>
                  <dd>{o('customer.address.thoroughfare')}</dd>
                  <dd>{o('customer.address.locality')}</dd>
                  <dd>{o('customer.address.postal_code')}</dd>
                  <dt>&nbsp;</dt>
                  <dd>&nbsp;</dd>
                  <dt>Special Instructions</dt>
                  <dd>{o('special_instructions')}</dd>
                  <dt>&nbsp;</dt>
                  <dd>&nbsp;</dd>
                  <dt>Last Updated</dt>
                  <dd>{ formatDate(o('changed')) }</dd>
                </dl>
              </div>
            </div>
          <br/>
          <div className="container">
            <h4>Documents</h4>
            <button onClick={this.onClickCreatePod.bind(this)} className="btn-primary btn add-pod-button">Create New P.O.D.</button>
            <div className="container pod-list-container">
            { renderPODList(props, o)}
            </div>
          </div>
        <br/>
        <br/>
          <div>
            <div className="container product-table-container">
          <div className="row product-table">
            <div className="width80perc automargin">
              <h4>Product Totals</h4>
              <div className="panel-body">
                <table className="table">
              <thead>
              <tr>
              <th>Product</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
            { renderTotals(order) }
            </tbody>
            </table>
              </div>
            </div>
          </div>
        </div>
          </div>
      </div>
  )
}
const mapStateToProps = (state) => {
  const { current_delivery, current_order_index } = state.deliveries;
  return { current_delivery, current_order_index };
};

const actions = {
  sceneChange,
  deliveryDocumentSelect,
};
const reduxHOC = connect(mapStateToProps, actions);

const meteorHOC =  withTracker(({ current_delivery }) => {
  return {
    delivery:  Deliveries.findOne({_id: current_delivery })
  };
});
export default compose(reduxHOC, meteorHOC)(DeliveryCustomerOrder);
