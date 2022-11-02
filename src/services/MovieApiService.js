export default class MovieApiService {
  constructor(apiKey) {
    this.query = '';
    this.page = 1;
    this.apiKey = apiKey;
  }

  /// TMP

  async getMovies() {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}&page=${this.page}`
    );

    if (response.ok) {
      response = await response.json();
    }
    return response;
  }

  setPage(page) {
    this.page = page;
  }

  setQuery(query) {
    this.query = query;
  }

  getQuery() {
    return this.query;
  }

  getPage() {
    return this.page;
  }
  // END TMP

  async searchMovies() {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}&page=${this.page}`
    );

    if (response.ok) {
      response = await response.json();
    }
    return response;
  }

  async getGenres() {
    let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`);

    if (response.ok) {
      response = await response.json();
    }
    return response;
  }

  async rateMovie(id, value) {
    await fetch(`https://api.themoviedb.org/3/movie/${id}/rating?api_key=<${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
    });
  }
}
