// Add global state
const global = {
  currentPage: window.location.pathname,
}

// Fetch and display popular movies
const displayPopularMovies = async () => {
  const { results } = await fetchAPIData('movie/popular')

  results.forEach((movie) => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
          : `<img src="images/no-image.jpg" alt="${movie.title}">`
      } 
      </a>
      <div class="card-body">
        <h3>${movie.title}</h3>
        <p>Release date: ${movie.release_date}</p>
      </div>
    `
    document.getElementById('popular-movies').appendChild(div)
  })
}

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
  const API_KEY = 'f2ea09585c04240200255b651d9f228b'
  const API_URL = 'https://api.themoviedb.org/3/'
  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await res.json()
  return data
}

// Set active nav link 'is-active' class
const setActiveLink = () => {
  const links = document.querySelectorAll('nav a')
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('is-active')
    }
  })
}

function init() {
  // Create a simple router
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('home page', window.location.pathname)
      break
    case '/movie-details.html':
      console.log('details: movie')
      break
    case '/search.html':
      console.log('search')
      break
    case '/shows.html':
      console.log('shows')
      break
    case '/tv-details.html':
      console.log('details: tv')
      break
    default:
      break
  }
  setActiveLink()
  displayPopularMovies()
}

document.addEventListener('DOMContentLoaded', init)
