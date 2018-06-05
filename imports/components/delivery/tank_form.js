import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { deepGet } from "../../../../imports/utils";
import PODapi from '../../../../imports/api/api_pod';
import classNames from 'classnames';
import _ from 'lodash';

import {
  sceneChange,
  tankFormSetTankNo
} from "../../actions";

p = new PODapi();

class TankForm extends Component {
  state = { tankNo: 0, type: null, before: 0, after: 0, mode: 'new' };
  componentWillMount() {
    if (!_.isEmpty(this.props.delivery)) {
      p.setOrder(this.props.delivery, this.props.current_order_index);
      if (this.props.tank_no > 0) {
        const data = p.getTank(this.props.current_delivery_document_key, this.props.tank_no);
        data.tankNo = this.props.tank_no;
        data.mode = 'edit';
        this.setState(data);
      }
    }
  }
  onChange(name,e){
    const partial = {};
    partial[name] = e.target.value;
    this.setState(partial);
  }
  onTypeChange(value){
    this.setState({type: value});
  }
  onClose() {
    this.props.sceneChange(this.props.calling_scene);
  }
  onSave() {
    p.setTank(
        this.props.current_delivery_document_key,
        this.state.tankNo, {
          type: this.state.type,
          before: this.state.before,
          after: this.state.after
        }
    );
    this.props.tankFormSetTankNo(this.state.tankNo);
    this.onClose();
  }
  onDelete() {
    p.removeTank(this.props.current_delivery_document_key, this.state.tankNo);
    this.props.tankFormSetTankNo(0);
    this.onClose();
  }
  renderTankNoOptions() {
    let tankNos = p.getUnusedTankNumbers(this.props.current_delivery_document_key);
    if (this.state.tankNo > 0  && (! _.includes(tankNos, parseInt(this.state.tankNo)))) {
      tankNos.push(parseInt(this.state.tankNo));
      tankNos.sort((a,b)=>{return(parseInt(a) - parseInt(b))});
    }

    const result = tankNos.map((num)=>{
      return (<option className="tank-form-tank-option" key={num} value={num}>{num}</option>);
    })
    if (this.state.tankNo == 0) {
      result.unshift(<option className="tank-form-tank-noneselected-option" key={0} value={0}>Choose</option>);
    }
    return result;
  }
  selectOnFocus(e) {
    e.target.select();
  }
  render() {
    let diff_error = false;
    let total = parseInt(this.state.after) - parseInt(this.state.before);
    if (_.isNaN(total)) total = 0;
    if (total < 0) diff_error = true;
    let disableSave = false;
    if (diff_error || (total === 0) || _.isEmpty(this.state.type) || this.state.tankNo == 0) disableSave = true;
    if (_.isEmpty(this.props.delivery)) return <div>Loading....</div>;
    p.setOrder(this.props.delivery, this.props.current_order_index);
    const documentData =  p.getDoc(this.props.current_delivery_document_key);
    const doc = (path, def) => {
      let value = deepGet(documentData, path);
      if (_.isUndefined(value)) value = def;
      // console.log([path, value]);
      return value;
    };
    const time = (new Date()).getTime()/1000;
    return (
        <div className="width100perc">
        <div  className="text-center"><h3>Tank Reading Form</h3></div>
        <div className="container">
          <div className="tank-form">
            <div>
              <div className="container">
								<fieldset>
									<div className="row">
										<div className="col-xs-12 col-sm-4">
										</div>

										<div className="col-xs-12 col-sm-5">
                      <div>
                        Tank No
                        <div>
                          <select disabled={(this.state.mode=='edit')} value={this.state.tankNo} onChange={this.onChange.bind(this, 'tankNo')} name="tankNo" className={(this.state.tankNo == 0) ? "tank-select-zero" : "tank-select"}>
                            { this.renderTankNoOptions() }
                          </select>
                        </div>
                      </div>
                      <div>
                        {
                          ['ulp', '95ulp', 'lrp', 'di50', 'di500'].map((type)=>{
                            const src = '/images/product/'+type+'.png';
                            const classes = classNames({
                              'tank-form-type-images': true,
                              'tank-form-type-selected': (type === this.state.type ),
                              'tank-form-type-unselected': (type !== this.state.type)
                            });
                            return (<img onClick={this.onTypeChange.bind(this, type)} name='type' id={type} className={classes} key={src} src={src} />);
                          })
                        }
                      </div>
											Liters Before
											<input onFocus={this.selectOnFocus.bind(this)} required className="form-control" name="before" onChange={this.onChange.bind(this,'before')}  value={this.state.before} type="number" />

											Liters After
											<input onFocus={this.selectOnFocus.bind(this)} required className="form-control" name="after" onChange={this.onChange.bind(this,'after')} value={this.state.after} type="number" />
                      <br/>
                      {diff_error ||
                        <div>
                          <span className="tank-form-total-label">Total: </span>
                          <span className="tank-form-total">{total}</span>&nbsp;<span><em>&nbsp;liter</em></span>
                        </div>
                      }
                      { diff_error &&
                        <div className="alert alert-warning">The "after" measurement needs to be bigger than the "before" measurement.</div>
                      }
                      <button disabled={disableSave} onClick={this.onSave.bind(this)} className="btn-primary btn">Save</button>&nbsp;
                      <button onClick={this.onClose.bind(this)} className="btn btn-secondary">Cancel</button>
                      { (this.state.mode == 'edit') &&
                          <button onClick={this.onDelete.bind(this)} className="btn pull-right btn-danger">Delete</button>
                      }
										</div>
									</div>
								</fieldset>
 							</div>
            </div>
          </div>
        </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { calling_scene, tank_no } = state.tank_form;
  const { current_delivery, current_order_index, current_delivery_document_key } = state.deliveries;
  const { scene } = state.route;
  return { calling_scene, scene, current_delivery, current_order_index, current_delivery_document_key, tank_no };
};

const reduxHOC = connect(mapStateToProps, {
  sceneChange,
  tankFormSetTankNo
});

const meteorHOC =  withTracker(({ current_delivery }) => {
  return {
    delivery:  Deliveries.findOne({_id: current_delivery })
  };
});
export default compose(reduxHOC, meteorHOC)(TankForm);

