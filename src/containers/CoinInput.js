import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { fetchPrice } from '../actions/index.js';
import CoinSelector from './CoinSelector';
import {debounce} from 'throttle-debounce';


class CoinInput extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '...'
		}

		this.onChange = this.onChange.bind(this);
		this.fetchAmounts = debounce(700, this.fetchAmounts);
	}

	onChange(event) {
		this.setState({value: event.target.value});
		this.fetchAmounts(event.target.value);

		ga('send', 'event', 'Order', 'change amount');
	}

	printChange(e) {
  	this.fetchAmounts(e.target.value);
  }

	fetchAmounts(value) {
		let pair = `${this.props.selectedCoin.receive}${this.props.selectedCoin.deposit}`;
		let data = {
			pair: pair,
			lastEdited: this.props.type
		};

		data[this.props.type] = value;

		this.props.fetchPrice(data);
  }

	componentWillReceiveProps(nextProps) {
		if (nextProps.type === 'receive') {
			this.setState({ value: nextProps.price.receive });
		} else if (nextProps.type === 'deposit') {
			this.setState({ value: nextProps.price.deposit });
		}
	}

	render() {
		return (
		  <div className="form-group label-floating has-success is-focused">
		    <label htmlFor={this.props.type} className="control-label text-green">{this.props.type}</label>
		    <input type="text"
					className="form-control coin"
					id={`coin-input-${this.props.type}`}
					name={this.props.type}
					onChange={this.onChange.bind(this)}
					value={this.state.value}
				/>

		    <CoinSelector type={this.props.type} />
		  </div>
		);
	}
}


function mapStateToProps(state) {
	return {
		selectedCoin: state.selectedCoin,
		price: state.price
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		fetchPrice: fetchPrice,
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinInput);
