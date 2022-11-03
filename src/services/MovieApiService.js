export default class MovieApiService {
  constructor() {
    this.page = 1;
    this.apiKey = 'ef9b37af191a02261db8369a24706290';
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

  createGuestSession = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`);
    if (response.ok) {
      response = await response.json();
      this.sessionId = response.guest_session_id;
    }
  };

  searchMovies = async () => {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}&page=${this.page}`
    );

    if (response.ok) {
      response = await response.json();
    }
    return response;
  };

  getRatedMovies = async () => {
    let response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${this.sessionId}/rated/movies?api_key=${this.apiKey}`
    );

    if (response.ok) {
      response = await response.json();
      console.log(response);
    }
  };

  getGenres = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`);

    if (response.ok) {
      response = await response.json();
    }
    return response;
  };

  rateMovie = async (id, value) => {
    await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value }),
      }
    );
  };
}
