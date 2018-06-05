import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { deepGet, RandomID } from "../../../../imports/utils";
import PODapi from '../../../../imports/api/api_pod';
import RoverCamera from '../../lib/camera'
import TimePicker from '../time_picker'
import Tanks from './tanks';
import {
  sceneChange,
  imageSelect,
  setImageViewCallingScene,
  sigPadSetCallingScene,
  sigPadSetSigId
} from "../../actions";

p = new PODapi();
//todo: make delete work

class DeliveryDocumentForm extends Component {
  state = { deleteClicked: 1};
  onClose() {
    this.props.sceneChange('customer_order');
  }

  onDelete() {
    this.setState({deleteClicked: this.state.deleteClicked + 1});
    if (this.state.deleteClicked > 2) {
      p.removeDoc(this.props.current_delivery_document_key);
      this.onClose();
    }
  }

  onClickAddImage() {
   RoverCamera.takePicture((error, image)=>{
     let id = p.addImage(this.props.current_delivery_document_key, image);
   })
  }

  onClickImage(image) {
    this.props.imageSelect(image);
    this.props.setImageViewCallingScene(this.props.scene) ;
    this.props.sceneChange('image_view', {pushState: false, bottom: false});
  }

  selectOnFocus(e) {
    e.target.select();
  }

  renderPictureList(images, disabled) {
    if (_.isEmpty(images)) return <div>No Images yet</div>;
    return images.map((image)=>{
      return (
          <img onClick={()=>{(!disabled) && this.onClickImage(image)}} key={image.id} src={image.url} className="image_thumbnail"/>
      );
    });
  }
  removeSignatures() {
    p.removeSignature(this.props.current_delivery_document_key, 'customer');
    p.removeSignature(this.props.current_delivery_document_key, 'driver');
  }
  onSaveDepartDate(moment) {
    p.setDepartDate(this.props.current_delivery_document_key, moment.unix());
  }
  onSaveArriveDate(moment) {
    p.setArriveDate(this.props.current_delivery_document_key, moment.unix());
  }
  onChangeKmBefore(e){
    p.setField(this.props.current_delivery_document_key, 'km_before', e.target.value);
  }
  onChangeKmAfter(e){
    p.setField(this.props.current_delivery_document_key, 'km_after', e.target.value);
  }
  onChangeTruckReg(e){
    p.setField(this.props.current_delivery_document_key, 'truck_registration_no', e.target.value);
  }
  onAddSignature(sig_id){
    this.props.sigPadSetCallingScene(this.props.scene);
    this.props.sigPadSetSigId(sig_id);
    this.props.sceneChange('signature_pad');
  }
  onFinalise() {

    p.finalise(this.props.current_delivery_document_key);
    Meteor.call('SendDeliveryDoc', this.props.current_delivery, this.props.current_order_index, this.props.current_delivery_document_key);
    this.onClose();
  }

  render() {
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
    const arrival = moment((doc('arrival_time')||time)*1000);
    const departure = moment((doc('departure_time')||time)*1000);
    const timeValidates = ( doc('arrival_time') > doc('departure_time'));
    const kmValidate =  (parseInt(doc('km_after')) > parseInt(doc('km_before')));
    const formCompleted =
        ( doc('arrival_time') > doc('departure_time'))
        && ( doc('signature_customer.valid') && doc('signature_driver.valid'))
        && ( parseInt(doc('km_after')) > parseInt(doc('km_before')))
        && ( doc('truck_registration_no'))
        && ( doc('images.0'))
    ;
    const formValidates =
        ( doc('arrival_time') > doc('departure_time'))
        && ( parseInt(doc('km_after')) > parseInt(doc('km_before')))
        && ( doc('images.0'))
        && ( doc('truck_registration_no'))
        && ( ! _.isEmpty(doc('tanks')) )
    ;
    const formDisabled = doc('signature_customer.valid') || doc('signature_driver.valid');
    return (
        <div className="width100perc">
        <div  className="text-center"><h3>POD Document Entry Form</h3></div>
        <div className="container">
          <div className="pod-form">
            <div className="picture-container-wrapper width100perc text-center">
              <div className="pictures-container">
                { this.renderPictureList(doc('images')||[], formDisabled) }
              </div>
              { (! doc('images').length ) &&
              <div className="alert-warning alert">Remember take a camera images of the tank reading slips/guage in order to continue</div>
              }
            </div>
            { !formDisabled &&
              <button disabled={formDisabled} onClick={this.onClickAddImage.bind(this)} className="btn btn-primary pull-right add-image-button">+Image</button>
            }
            &nbsp;
            <div>
              <div className="container">
								<fieldset>
									<div className="row">
										<div className="col-xs-12 col-sm-4">
                     <TimePicker disabled={formDisabled} onSave={this.onSaveDepartDate.bind(this)} title="Departure Time" moment={departure}>
											Departure Time:
                      <div className="fakeInput">
                        {doc('departure_time') ? departure.format('llll') : ""}
                      </div>
                     </TimePicker>
                     <TimePicker disabled={formDisabled} onSave={this.onSaveArriveDate.bind(this)} title="Arrival Time" moment={arrival}>
											Arrival Time:
                      <div className="fakeInput">
                        {doc('arrival_time') ? arrival.format('llll') : ""}
                      </div>
                     </TimePicker>
                      { (! timeValidates) &&
                        <div className="alert-warning alert">The departure time must be before the arrival time.</div>
                      }
										</div>

										<div className="col-xs-12 col-sm-5">
											Kilometers Before
											<input onFocus={this.selectOnFocus.bind(this)}  disabled={formDisabled} required className="form-control" onChange={this.onChangeKmBefore.bind(this)}  value={doc('km_before',0)} type="number" />

											Kilometers After
											<input onFocus={this.selectOnFocus.bind(this)} disabled={formDisabled} required className="form-control" onChange={this.onChangeKmAfter.bind(this)} value={doc('km_after',0)} type="number" />
                      { (! kmValidate) &&
                      <div className="alert-warning">The "after" km must be more than the "before" km</div>
                      }
										</div>
										<div className="col-xs-12 col-sm-4">
											Truck Registration Number
											<input onFocus={this.selectOnFocus.bind(this)} disabled={formDisabled} required className="form-control" onChange={this.onChangeTruckReg.bind(this)} value={doc('truck_registration_no',"")} type="text" />
                      { (!doc('truck_registration_no')) &&
                        <div className="alert-warning">Please fill in registration no</div>
                      }
										</div>
									</div>
								</fieldset>
                <Tanks disabled={formDisabled} tanks={doc('tanks', {})}/>
 							</div>
              {doc('signature_customer.valid') &&
                <img src={doc('signature_customer.url')} className="pod-signature-customer pod-signature"/>
              }

              <br/>
              {doc('signature_driver.valid') &&
                <img src={doc('signature_driver.url')} className="pod-signature-driver pod-signature"/>
              }
              <div className="pull-right">
              {!doc('signature_customer.valid')  && formValidates &&
                <button onClick={this.onAddSignature.bind(this,'customer')} className="btn btn-secondary add-sig-button">Add Customer Signature</button>
              }
              {!doc('signature_driver.valid')  && formValidates &&
                <div>
                <br/>
                <button onClick={this.onAddSignature.bind(this,'driver')} className="btn btn-secondary add-sig-button">Add Driver Signature</button>
                </div>
              }
              <br/>
              {formCompleted && (!doc('finalised')) &&
                <button onClick={this.removeSignatures.bind(this)} className="btn btn-warning pull-right" >Remove Signatures</button>
              }
              </div>
              <div className="width100perc pull-right">
              {formCompleted && (! doc('finalised')) &&
                <button onClick={this.onFinalise.bind(this)} className="btn btn-primary">Finalise and Send</button>
              }
              {formCompleted && (doc('finalised')) &&
                <button onClick={this.onFinalise.bind(this)} className="btn btn-primary">Resend</button>
              }
              <br/>
                { (! formCompleted) &&
                  <button onClick={this.onDelete.bind(this)} className="btn btn-danger pull-right margin5">
                    { (this.state.deleteClicked >= 3) &&
                      <span>Delete Now</span>
                    }
                    { (this.state.deleteClicked < 3) &&
                      <span>Delete x{ 4 - this.state.deleteClicked }</span>
                    }
                  </button>
                }
                <button onClick={this.onClose.bind(this)} className="btn btn-warning pull-right margin5">Close</button>&nbsp;

              </div>
              <br/>
                <br/>
                <br/>
                <br/>
                <br/>
              </div>
            <br/>
            <br/>
            <br/>
            </div>
          </div>
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
  imageSelect,
  setImageViewCallingScene,
  sigPadSetCallingScene,
  sigPadSetSigId
});

const meteorHOC =  withTracker(({ current_delivery }) => {
  return {
    delivery:  Deliveries.findOne({_id: current_delivery })
  };
});
export default compose(reduxHOC, meteorHOC)(DeliveryDocumentForm);

