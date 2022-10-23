import React, { Component } from 'react';
import { Tabs, Layout, Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MovieApiService from '../../services/MovieApiService';
import Card from '../Card';
import Searchbar from '../Searchbar';
import DetectOffline from '../DetectOffline';

const { Footer, Content } = Layout;
const loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// Define global variables:
const FILMS_PER_PAGE = 6;

export default class App extends Component {
  movieApi = new MovieApiService();

  constructor(props) {
    super(props);
    this.state = {
      films: [],
      loading: false,
      minValue: 0,
      maxValue: FILMS_PER_PAGE,
      possibleValue: 60,
    };
  }

  fetchData = (query) => {
    this.setState(() => ({ loading: true }));
    this.movieApi.setPage(1);
    this.movieApi.newQuery(query);
    this.movieApi.getMovies().then((films) => {
      this.setState(() => ({
        films: [
          ...films.results,
          ...new Array(
            films.total_results >= 20 ? films.total_results - 20 : films.total_results - films.total_results
          ).fill(undefined),
        ],
        loading: false,
        possibleValue: films.total_results,
        minValue: 0,
        maxValue: FILMS_PER_PAGE,
        currentTab: 1,
        totalPages: films.total_pages,
      }));
    });
  };

  changePaginationTab = async (value) => {
    this.setState(() => ({ loading: true }));
    const { films, totalPages } = this.state;
    const page = Math.floor((value * 6) / 20);

    const Arr = [[], [], []];

    if (page > 0) {
      Arr[0] = films.slice((page - 1) * 20, (page - 1) * 20 + 20);
    }
    Arr[1] = films.slice(page * 20, page * 20 + 20);

    if (page < totalPages) {
      Arr[2] = films.slice((page + 1) * 20, (page + 1) * 20 + 20);
    }

    if (Arr[0].includes(undefined)) {
      this.movieApi.setPage(page);
      await this.movieApi.getMovies().then((result) => {
        Arr[0] = result.results;
      });
    }

    if (Arr[1].includes(undefined)) {
      this.movieApi.setPage(page + 1);
      await this.movieApi.getMovies().then((result) => {
        Arr[1] = result.results;
      });
    }

    if (Arr[2].includes(undefined)) {
      this.movieApi.setPage(page + 2);
      await this.movieApi.getMovies().then((result) => {
        Arr[2] = result.results;
      });
    }

    const Arr1 = films.slice(0, page * 20 - Number(Arr[0].length > 0) * 20);
    const Arr2 = films.slice((page + 1) * 20 + Number(Arr[2].length > 0) * 20, films.length);
    this.setState(() => ({
      films: [...Arr1, ...Arr.flat(), ...Arr2],
      minValue: (value - 1) * FILMS_PER_PAGE,
      maxValue: value * FILMS_PER_PAGE,
      loading: false,
      currentTab: value,
    }));
  };

  // changePaginationTab = (value) => {
  //   this.setState(() => ({ loading: true }));
  //   const { films, possibleValue } = this.state;
  //   const page = Math.floor((value * 6) / 20);
  //   const prevPage = films.slice((value - 1) * 6 - 6, (value - 1) * 6);
  //   console.log(prevPage, prevPage.includes(undefined));
  //   const containsUndefined = films.slice(value * 6 - 6, value * 6).includes(undefined);
  //   if (containsUndefined) {
  //     this.movieApi.setPage(page);
  //     this.movieApi.getMovies().then((result) => {
  //       const newArr0 = films.slice(0, page * 20);
  //       const newArr1 = films.slice((page + 1) * 20, films.length - 1);
  //       let finish = possibleValue;
  //       if (value * FILMS_PER_PAGE < finish) {
  //         finish = value * FILMS_PER_PAGE;
  //       }
  //       this.setState(() => ({
  //         films: [...newArr0, ...result.results, ...newArr1],
  //         minValue: (value - 1) * FILMS_PER_PAGE,
  //         maxValue: finish,
  //         loading: false,
  //         currentTab: value,
  //       }));
  //     });
  //   } else {
  //     this.setState(() => ({
  //       minValue: (value - 1) * FILMS_PER_PAGE,
  //       maxValue: value * FILMS_PER_PAGE,
  //       loading: false,
  //       currentTab: value,
  //     }));
  //   }
  // };

  render() {
    const { films, loading, minValue, maxValue, possibleValue, currentTab } = this.state;
    let films2 = [];
    if (films.length > 0) {
      films2 = films
        .slice(minValue, maxValue)
        .map((film) => (
          <Card
            title={film.title}
            releaseDate={film.release_date}
            overview={film.overview}
            voteAverage={film.vote_average}
            poster={film.poster_path}
            key={`${film.id}${film.release_date.split('-').join('')}`}
          />
        ));
    }

    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
          <DetectOffline>
            <Layout>
              <Searchbar fetchData={this.fetchData} />
              <Content>{loading ? <Spin indicator={loader} /> : films2}</Content>
              <Footer>
                <Pagination
                  size="small"
                  defaultCurrent={1}
                  total={possibleValue}
                  disabled={loading || !films.length}
                  pageSize={6}
                  showSizeChanger={false}
                  onChange={this.changePaginationTab}
                  current={currentTab}
                />
              </Footer>
            </Layout>
          </DetectOffline>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rated" key="2" disabled>
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
