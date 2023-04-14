// Add global state
const global = {
  currentPage: window.location.pathname,
}

// Feth data from TMDB API
const getData = async (endpoint) => {
  const API_KEY = 'f2ea09585c04240200255b651d9f228b'
  const API_URL = 'https://api.themoviedb.org/3/'
  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await res.json()
  console.log(data)
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
  getData()
}

document.addEventListener('DOMContentLoaded', init)
