import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { sceneChange} from "../actions";
import PODapi from '../../../imports/api/api_pod';
import signature_pad from 'signature_pad';
// import { deepGet } from "../../../imports/utils";

class SignaturePad extends Component {
  componentWillMount() {
    this.p = new PODapi();
    if (this.props.delivery) this.p.setOrder(this.props.delivery, this.props.current_order_index);
  }
  resizeSignatureCanvas() {
      let canvas = this.canvas;
			const ratio =  Math.max(window.devicePixelRatio || 1, 1);
			canvas.width = canvas.offsetWidth * ratio;
			canvas.height = canvas.offsetHeight * ratio;
			canvas.getContext("2d").scale(ratio, ratio);
			this.sigPad.clear(); // otherwise isEmpty() might return incorrect value
	};
  componentDidMount() {
    this.sigPad = new signature_pad(this.canvas);
    this.resizeSignatureCanvas();
  }

  onClickClose () {
    this.props.sceneChange(this.props.calling_scene, {pushState: false, bottom: false});
  }
  onClickSave() {
    this.p.setSignature(this.props.current_delivery_document_key, this.props.sig_id, this.sigPad.toDataURL());
    this.onClickClose();
  }
  render() {
    return (
        <div className="width100perc container">
          <button onClick={this.onClickClose.bind(this)} className="btn-secondary pull-right">Close</button>
          &nbsp;
          <button onClick={this.onClickSave.bind(this)} className="btn-primary pull-right">Save</button>
          <span>Signature Pad</span>
          <canvas className="signature-canvas" ref={el => this.canvas = el} />
        </div>
		);
  }
}

const mapStateToProps = (state) => {
  const { current_delivery, current_order_index, current_delivery_document_key } = state.deliveries;
  const id  =  current_delivery;
  const sig_id = state.signature_pad.id;
  const calling_scene = state.signature_pad.calling_scene;
  return { sig_id, id, calling_scene, current_order_index, current_delivery_document_key };
};

const reduxHOC = connect(mapStateToProps, {
  sceneChange
 });

const meteorHOC =  withTracker(({ id }) => {
  return {
    delivery:  Deliveries.findOne({_id: id })
  };
});
export default compose(reduxHOC, meteorHOC)(SignaturePad);
