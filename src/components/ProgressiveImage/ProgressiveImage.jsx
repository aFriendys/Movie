import { Component } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const loader = <LoadingOutlined style={{ fontSize: 12 }} spin />;

export default class ProgressiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  render() {
    const { loaded } = this.state;
    const { path } = this.props;

    const poster =
      path === null ? 'https://critics.io/img/movies/poster-placeholder.png' : `https://image.tmdb.org/t/p/w500${path}`;
    return (
      <>
        {loaded ? null : <Spin indicator={loader} />}
        <img
          alt="film preview"
          style={loaded ? {} : { display: 'none' }}
          src={poster}
          onLoad={() => this.setState({ loaded: true })}
        />
      </>
    );
  }
}
