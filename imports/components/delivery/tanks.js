import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import {
  sceneChange,
  tankFormSetTankNo,
  setTankFormCallingScene,
} from "../../actions";


class Tanks extends Component {
  onAddReadingClick() {
    this.props.setTankFormCallingScene(this.props.scene);
    this.props.sceneChange('tank_form');
    this.props.tankFormSetTankNo(0); //signals creation of new one
    //todo: finish scene jumping and wiring in of tank_form and tanks
  }
  onClickTank(tankNo) {
    if(this.props.disabled) return;
    this.props.setTankFormCallingScene(this.props.scene);
    this.props.sceneChange('tank_form');
    this.props.tankFormSetTankNo(tankNo);
  }
  componentWillMount() {

  }
  renderAddReadingButton() {
    return (
        <button onClick={this.onAddReadingClick.bind(this)} className="btn btn-primary">Add Reading</button>
    )
  }
  renderTankList() {
    let result = [];
    for (let tankNo in this.props.tanks) {
      if (this.props.tanks.hasOwnProperty(tankNo)) {
        const tank = this.props.tanks[tankNo];
        result.push(
            <tr onClick={this.onClickTank.bind(this,tankNo)} key={tankNo}>
              <td> {tankNo} </td>
              <td>
                <img style={{'minHeight': '13px', 'maxHeight': '19px'}}
                     className='img-responsive'
                     src={'images/product/' + tank.type + '.png'}/>
              </td>
              <td>
                <div className="row">
                  <div className="col-sm-6">{tank.before}&nbsp;<em>l</em></div>
                  <div className="col-sm-6">{tank.after}&nbsp;<em>l</em></div>
                </div>
              </td>
              <td>{ tank.after - tank.before }</td>
            </tr>
        );
      }
    }
    return result;
  }

  render() {
    return (
      <div>
        <table className="width100perc table-condensed table-hover">
          <thead>
          <tr>
            <th> Tank </th><th> Product </th>
            <th>
              <div className="row">
                <div className="col-sm-6">After</div>
                <div className="col-sm-6">Before</div>
              </div>
            </th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>{ this.renderTankList() }</tbody>
        </table>
        { (_.isEmpty(this.props.tanks)) &&
        <div className="alert-warning alert">Please add a tank reading in order to proceed</div>
        }
        { (! this.props.disabled) && this.renderAddReadingButton() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { current_delivery, current_order_index, current_delivery_document_key } = state.deliveries;
  const { scene } = state.route;
  return { scene, current_delivery, current_order_index, current_delivery_document_key };
};

const reduxHOC = connect(mapStateToProps, {
  sceneChange,
  tankFormSetTankNo,
  setTankFormCallingScene
});

const meteorHOC =  withTracker(({ current_delivery }) => {
  return {
    delivery:  Deliveries.findOne({_id: current_delivery })
  };
});
export default compose(reduxHOC, meteorHOC)(Tanks);

