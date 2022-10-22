export default class MovieApiService {
  apiKey = 'ef9b37af191a02261db8369a24706290';

  constructor() {
    this.query = '';
    this.searchPage = 1;
  }

  async getGenres() {
    let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`);

    if (response.ok) {
      response = await response.json();
    }
    return response;
  }

  async getMovies() {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}&page=${this.page}`
    );

    if (response.ok) {
      response = await response.json();
    }
    return response;
  }

  newQuery = (query) => {
    this.query = query;
  };

  setPage = (page) => {
    this.page = page;
  };
}

//   const api = new MovieApiService();
// api.getGenres().then((res) => console.log(res));
// api.getMovies('return').then((res) => console.log(res));
