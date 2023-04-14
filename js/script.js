const global = {
  currentPage: window.location.pathname,
}
// Create a simple router
console.log(global.currentPage)

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('home page')
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
}

init()
