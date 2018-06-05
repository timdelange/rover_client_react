import React, { Component } from 'react';
import InputMoment from './3rd_party/input_moment/input-moment';


class TimePicker extends Component {
  state = {
    entryMode: false,
    showValue: "",
    value: null,
    moment: this.props.moment
  };

  onChange(e) {
    console.log(e);
  }
  handleChange(moment) {
    this.setState({moment});
  }

  handleSave() {
    this.setState({entryMode: false});
    this.props.onSave(this.state.moment);
  }

  renderChildren() {
    this.props.children.forEach((child)=>{
      if (child.hasOwnProperty('props')) {
        child.props.onClick = () => {
          console.log('clickb');
          (! this.props.disabled) && this.setState({entryMode: true})
        }
      }
    });
    return this.props.children;
  }

  render () {
    if (!this.state.entryMode) return (
        <div className="up-z" onClick={()=>{  console.log('clicka') ; (! this.props.disabled) && this.setState({entryMode: true})}}>
          {this.props.children}
        </div>
    )
    return (
        <div className="overlay text-center">
          <h2>{this.props.title}</h2>
        <InputMoment
            moment={this.state.moment}
            onChange={this.handleChange.bind(this)}
            onSave={this.handleSave.bind(this)}
            minStep={1} // default
            hourStep={1} // default
            prevMonthIcon="glyphicon glyphicon-chevron-left" // default
            nextMonthIcon="glyphicon glyphicon-chevron-right" // default
        />
        </div>
    )
  }
}

export default TimePicker;