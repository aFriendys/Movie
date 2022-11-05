import React, { Component } from 'react';
import { Tabs, Layout, Pagination, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MovieApiService from '../../services/MovieApiService';
import Card from '../Card';
import SearchBar from '../Searchbar';
import DetectOffline from '../DetectOffline';
import { MyContextProvider } from '../MyContext';

const { Footer, Content } = Layout;
const loader = <LoadingOutlined style={{ fontSize: 40 }} spin />;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      loading: false,
      filmsRated: [],
      loadingRated: false,
      possibleValue: 200,
      triedSearch: false,
    };
    this.movieService = new MovieApiService();
  }

  componentDidMount() {
    this.movieService.createGuestSession();
    this.movieService.getGenres().then((result) => {
      this.setState(() => ({ genres: result.genres }));
    });
  }

  clearFilms = () => {
    this.movieService.setPage('search', 1);
    this.setState({ films: [], possibleValue: 200 });
  };

  searchRated = (page) => {
    this.setState(() => ({ loadingRated: true }));
    this.movieService.setPage('rated', page);

    this.movieService.getRatedMovies().then((films) => {
      this.setState(() => ({
        filmsRated: [...films.results],
        loadingRated: false,
        possibleValue: films.total_results ? films.total_results : 200,
      }));
    });
  };

  fetchData = (query, page) => {
    this.setState(() => ({ loading: true, triedSearch: true }));
    if (query) {
      this.movieService.setQuery(query);
    }
    this.movieService.setPage('search', page);
    this.movieService.searchMovies().then((films) => {
      this.setState(() => ({
        films: [...films.results],
        loading: false,
        possibleValue: films.total_results ? films.total_results : 200,
      }));
    });
  };

  changeTab = (value) => {
    if (value === 'rated') {
      this.searchRated(this.movieService.getPage('rated'));
    } else {
      this.fetchData('', this.movieService.getPage('search'));
    }
  };

  render() {
    const { films, loading, possibleValue, genres, triedSearch, filmsRated, loadingRated } = this.state;

    let filmsDecrypted = triedSearch ? (
      <Alert message="Error" description="The search has not given any results." type="warning" showIcon />
    ) : (
      <Alert message="Info" description="Enter your search query above to start" type="info" showIcon />
    );
    if (films.length) {
      filmsDecrypted = films.map((film) => (
        <Card
          id={film.id}
          genreIds={film.genre_ids}
          title={film.title}
          releaseDate={film.release_date}
          overview={film.overview}
          voteAverage={film.vote_average}
          poster={film.poster_path}
          key={film.id}
          userRate={0}
          rateMovie={this.movieService.rateMovie}
        />
      ));
    }
    const filmsRatedDecrypted = filmsRated.length ? (
      filmsRated.map((film) => (
        <Card
          id={film.id}
          genreIds={film.genre_ids}
          title={film.title}
          releaseDate={film.release_date}
          overview={film.overview}
          voteAverage={film.vote_average}
          poster={film.poster_path}
          key={film.id}
          userRate={0}
          rateMovie={this.movieService.rateMovie}
        />
      ))
    ) : (
      <Alert message="Info" description="Enter your search query above to start" type="info" showIcon />
    );
    return (
      <MyContextProvider value={genres}>
        <Tabs
          onChange={this.changeTab}
          defaultActiveKey="1"
          items={[
            {
              label: 'Search',
              key: 'search',
              children: (
                <DetectOffline>
                  <Layout style={{ height: 'unset', minHeight: '100%' }}>
                    <SearchBar fetchData={this.fetchData} clearFilms={this.clearFilms} />
                    <Content>{loading ? <Spin indicator={loader} /> : filmsDecrypted}</Content>
                    <Footer>
                      <Pagination
                        size="small"
                        defaultCurrent={1}
                        total={possibleValue}
                        disabled={loading || !films.length}
                        pageSize={20}
                        showSizeChanger={false}
                        onChange={(value) => this.fetchData('', value)}
                        current={this.movieService.getPage('search')}
                      />
                    </Footer>
                  </Layout>
                </DetectOffline>
              ),
            },
            {
              label: 'Rated',
              key: 'rated',
              children: (
                <Layout style={{ height: 'unset', minHeight: '100%' }}>
                  <Content>{loadingRated ? <Spin indicator={loader} /> : filmsRatedDecrypted}</Content>
                  <Footer>
                    <Pagination
                      size="small"
                      defaultCurrent={1}
                      total={possibleValue}
                      disabled={loadingRated || !filmsRated.length}
                      pageSize={20}
                      showSizeChanger={false}
                      onChange={(value) => this.searchRated(value)}
                      current={this.movieService.getPage('rated')}
                    />
                  </Footer>
                </Layout>
              ),
            },
          ]}
        />
      </MyContextProvider>
    );
  }
}
