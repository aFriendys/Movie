import React, { Component } from 'react';
import { Tabs, Layout, Input, Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Card from '../Card';

const { Header, Footer, Content } = Layout;
const loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { films: [], loading: false };
  }

  fetchData = async (url) => {
    let films;
    let result;
    this.setState(() => ({ loading: true }));
    const response = await fetch(url);

    if (response.ok) {
      films = await response.json();
      result = await films.results;

      this.setState(() => ({ films: result, loading: false }));
    }
  };

  render() {
    const { films, loading } = this.state;
    let films2 = [];
    if (films.length > 0) {
      films2 = films
        .slice(0, 6)
        .map((film) => (
          <Card
            title={film.title}
            releaseDate={film.release_date}
            overview={film.overview}
            voteAverage={film.vote_average}
            poster={film.poster_path}
          />
        ));
    }

    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
          <Layout>
            <Header>
              <Input
                placeholder="Basic usage"
                onChange={() => {
                  this.fetchData(
                    'https://api.themoviedb.org/3/search/movie?api_key=ef9b37af191a02261db8369a24706290&query=return'
                  );
                }}
              />
            </Header>
            <Content>{loading ? <Spin indicator={loader} /> : films2}</Content>
            <Footer>
              <Pagination defaultCurrent={1} total={50} />
            </Footer>
          </Layout>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rated" key="2">
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
