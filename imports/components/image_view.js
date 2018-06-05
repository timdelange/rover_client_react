import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { sceneChange} from "../actions";
import PODapi from '../../../imports/api/api_pod';

// import { deepGet } from "../../../imports/utils";

class ImageView extends Component {
  componentWillMount() {
    this.p = new PODapi();
    this.p.setOrder(this.props.delivery, this.props.current_order_index);
  }

  onClickClose () {
    this.props.sceneChange(this.props.calling_scene, {pushState: false, bottom: false});
  }
  onClickDelete () {
    this.p.removeImage(this.props.current_delivery_document_key, this.props.image.id);
    this.props.sceneChange(this.props.calling_scene, {pushState: false, bottom: false});
  }
  render() {
    let image = this.props.image;
    return (
        <div className="width100perc container">
          <button onClick={this.onClickDelete.bind(this)} className="btn-primary pull-right">Delete</button>
          <button onClick={this.onClickClose.bind(this)} className="btn-secondary pull-right">Close</button>
          <span>Image View</span>
          <img className="width100perc" src={image.url} key={image.id} />
        </div>
		);
  }
}

const mapStateToProps = (state) => {
  const { current_delivery, current_order_index, current_delivery_document_key } = state.deliveries;
  const id  =  current_delivery;
  const image = state.image_view.selected_image;
  const calling_scene = state.image_view.calling_scene;
  return { id,image,calling_scene, current_order_index, current_delivery_document_key };
};

const reduxHOC = connect(mapStateToProps, {
  sceneChange
 });

const meteorHOC =  withTracker(({ id }) => {
  return {
    delivery:  Deliveries.findOne({_id: id })
  };
});
export default compose(reduxHOC, meteorHOC)(ImageView);
