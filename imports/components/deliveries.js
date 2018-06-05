import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DeliveriesList from './deliveries_list';
import { withTracker } from 'meteor/react-meteor-data';
import {
  deliveriesLoadMore,
  deliveriesUpdateSearch
} from "../actions";

class Deliveries extends Component {
  loadMore() {
    Session.set('jobLimit', Session.get('jobLimit') + Meteor.settings.public.jobLimit );
  }

  resetCount() {
    Session.set('jobLimit', Meteor.settings.public.jobLimit || 10);
  }
  onSearchChange(e) {
    this.props.deliveriesUpdateSearch(e.target.value);
  }
  render() {
    return (
      <div className="container bf-page">
        <div className="list-group">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <form>
                  <div className="form-group">
                    <input
                      className="form-control search-query"
                      placeholder="#number or text to find"
                      id="deliverySearchInput"
                      type="search"
                      onChange={this.onSearchChange.bind(this)}
                      value={this.props.search}
                    />
                  </div>
                </form>
                <DeliveriesList limit={this.props.jobLimit} search={this.props.search} />
                <div className="container text-center">
                  Displaying up to {this.props.jobLimit} of the latest records.
                  <br/> <button onClick={this.loadMore.bind(this)} className="btn btn-primary">Load More</button>
                    <br/><br/> <button onClick={this.resetCount.bind(this)} className="btn btn-default">Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { auth, deliveries } = state;
  const { loggedIn } = auth;
  const { search, jobLimit } = deliveries;
  return { loggedIn, search, jobLimit };
};

const reduxHOC =  connect(mapStateToProps, { deliveriesLoadMore, deliveriesUpdateSearch});

const meteorHOC =  withTracker(({ search }) => {
  return {};
});

export default compose(meteorHOC,reduxHOC)(Deliveries);

