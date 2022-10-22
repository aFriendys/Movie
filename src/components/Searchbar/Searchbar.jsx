import { Input, Layout } from 'antd';
import { Component } from 'react';

const { Header } = Layout;
export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = { label: '' };
  }

  onInputChange = (e) => {
    this.setState(() => ({ label: e.target.value }));
  };

  render() {
    const { label } = this.state;
    const { fetchData } = this.props;
    return (
      <Header>
        <Input
          placeholder="Basic usage"
          value={label}
          onChange={this.onInputChange}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              fetchData(label);
            }
          }}
        />
      </Header>
    );
  }
}
