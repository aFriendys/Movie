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
  static addRated = (newFilm) => {
    let storedFilms = JSON.parse(localStorage.getItem('films'));
    storedFilms = storedFilms === 'null' ? newFilm : { ...storedFilms, ...newFilm };
    localStorage.setItem('films', JSON.stringify(storedFilms));
  };

  constructor(props) {
    super(props);
    this.state = {
      films: [],
      loading: false,
      possibleValue: 200,
      currentTab: 1,
      triedSearch: false,
    };
  }

  componentDidMount() {
    let apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      apiKey = 'ef9b37af191a02261db8369a24706290';
      localStorage.setItem('apiKey', apiKey);
    }
    this.movieService = new MovieApiService(apiKey);

    this.movieService.getGenres().then((result) => {
      this.setState(() => ({ genres: result.genres }));
    });
  }

  clearFilms = () => this.setState({ films: [], currentTab: 1, possibleValue: 200 });

  fetchData = (query, page) => {
    this.setState(() => ({ loading: true, triedSearch: true }));
    if (query) {
      this.movieService.setQuery(query);
    }
    if (page) {
      this.movieService.setPage(page);
    }
    this.movieService.getMovies().then((films) => {
      this.setState(() => ({
        films: [...films.results],
        loading: false,
        possibleValue: films.total_results !== 0 ? films.total_results : 200,
        currentTab: page || this.movieService.getPage(),
      }));
    });
  };

  render() {
    const { films, loading, currentTab, possibleValue, genres, triedSearch } = this.state;

    let filmsDecrypted = triedSearch ? (
      <Alert message="Error" description="The search has not given any results." type="warning" showIcon />
    ) : (
      <Alert message="Info" description="Enter your search query above to start" type="info" showIcon />
    );
    if (films.length) {
      filmsDecrypted = films.map((film) => {
        let storedRate = JSON.parse(localStorage.getItem('films'));
        storedRate = storedRate?.[film.id]?.userRate || 0;
        return (
          <Card
            id={film.id}
            genreIds={film.genre_ids}
            title={film.title}
            releaseDate={film.release_date}
            overview={film.overview}
            voteAverage={film.vote_average}
            poster={film.poster_path}
            key={film.id}
            addRated={App.addRated}
            userRate={storedRate}
          />
        );
      });
    }
    return (
      <MyContextProvider value={genres}>
        <Tabs
          onChange={(value) => {
            if (value === 'search') {
              if (this.movieService.getQuery()) {
                this.fetchData();
              } else {
                this.setState(() => ({ films: [] }));
              }
            }
            if (value === 'rated') {
              const rated = JSON.parse(localStorage.getItem('films'));
              this.setState(() => ({ films: Object.values(rated) }));
            }
          }}
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
                        current={currentTab}
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
                  <Content>{filmsDecrypted}</Content>
                </Layout>
              ),
            },
          ]}
        />
      </MyContextProvider>
    );
  }
}
