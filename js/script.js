// Add global state
const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'f2ea09585c04240200255b651d9f228b',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
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

// Fetch and display popular tv shows
const displayPopularShows = async () => {
  const { results } = await fetchAPIData('tv/popular')

  results.forEach((show) => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">`
          : `<img src="images/no-image.jpg" alt="${show.name}">`
      }
      </a>
      <div class="card-body">
        <h3>${show.name}</h3>
        <p>Release date: ${show.first_air_date}</p>
      </div>
    `
    document.getElementById('popular-shows').appendChild(div)
  })
}

// Display movie details
const displayMovieDetails = async () => {
  const movieId = window.location.search.slice(4)
  const movie = await fetchAPIData(`movie/${movieId}`)

  displayBackgroundImage('movie', movie.backdrop_path)

  const div = document.createElement('div')
  div.classList.add('details')
  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="card-img-top">`
          : `<img src="images/no-image.jpg" alt="${movie.title}" class="card-img-top">`
      }
      </div>
      <div>
        <h1>${movie.title}</h1>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        ${
          movie.homepage &&
          `<a
            href="${movie.homepage}"
            target="_blank"
            class="btn btn-secondary">Visit Movie Homepage</a>`
        }
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
          movie.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
          movie.revenue
        )}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${movie.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(', ')}</div>
    </div>
  `
  document.querySelector('#movie-details').appendChild(div)
}

// Display tv show details
const displayShowDetails = async () => {
  const showId = window.location.search.slice(4)
  console.log(showId)
  const show = await fetchAPIData(`tv/${showId}`)

  displayBackgroundImage('tv', show.backdrop_path)

  const div = document.createElement('div')
  div.innerHTML = `
    <div class="details-top">
    <div>
    ${
      show.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" class="card-img-top">`
        : `<img src="images/no-image.jpg" alt="${show.name}" class="card-img-top">`
    }
    </div>
    <div>
      <h1>${show.name}</h1>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${show.first_air_date}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      ${
        show.homepage
          ? `<a
          href="${show.homepage}"
          target="_blank"
          class="btn">Visit Show Homepage</a>`
          : null
      }
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
          show.last_episode_to_air.air_date
        }
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}</div>
  </div>
  `

  document.querySelector('#show-details').appendChild(div)
}

const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
  const API_KEY = global.api.apiKey
  const API_URL = global.api.apiUrl

  showSpinner()
  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await res.json()

  hideSpinner()
  return data
}

// Make request to search
// Fetch data from TMDB API
const searchAPIData = async () => {
  const API_KEY = global.api.apiKey
  const API_URL = global.api.apiUrl

  showSpinner()
  const res = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )
  const data = await res.json()

  hideSpinner()
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

const showSpinner = () => {
  document.querySelector('.spinner').classList.add('show')
}

const hideSpinner = () => {
  document.querySelector('.spinner').classList.remove('show')
}

const displayBackgroundImage = (type, imagePath) => {
  const divOverlay = document.createElement('div')
  divOverlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${imagePath}
  )`
  divOverlay.classList.add('image-backdrop')
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(divOverlay)
  } else {
    document.querySelector('#show-details').appendChild(divOverlay)
  }
}

// Search movie and shows
const search = async () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  global.search.type = urlParams.get('type')
  global.search.term = urlParams.get('search-term')

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_results, total_pages, page } = await searchAPIData()
    console.log(results, total_results, total_pages, page)
    global.search.totalResults = total_results
    global.search.totalPages = total_pages
    global.search.page = page
    if (results.length === 0) {
      showAlert('No results found.')
      return
    }
    displayResults(results)
  } else {
    showAlert('Please enter a search term.')
  }
}

// Display search results
const displayResults = (results) => {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = ''
  document.querySelector('#search-results-heading').innerHTML = ''
  document.querySelector('#pagination').innerHTML = ''

  results.forEach((result) => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${
              result.poster_path
            }" alt="${
              global.search.type === 'movie' ? result.title : result.name
            }">`
          : `<img src="images/no-image.jpg" alt="${
              global.search.type === 'movie' ? result.title : result.name
            }">`
      }
      </a>
      <div class="card-body">
        <h3>${global.search.type === 'movie' ? result.title : result.name}</h3>
        <p>Release date: ${
          global.search.type === 'movie'
            ? result.release_date
            : result.first_air_date
        }</p>
      </div>
    `
    document.querySelector('#search-results-heading').innerHTML = `
      <h2>
        ${results.length} of ${global.search.totalResults}
        results for ${global.search.term}
      </h2>
    `
    document.getElementById('search-results').appendChild(div)
  })
  displayPagination(results)
}

// Pagination
const displayPagination = (results) => {
  const div = document.createElement('div')
  div.classList.add('pagination')
  div.innerHTML = `
    <button id="pagination-prev">Previous</button>
    <button id="pagination-next">Next</button>
    <p class="pagination-counter">Page ${global.search.page} of ${global.search.totalPages}</p>
  `
  document.querySelector('#pagination').appendChild(div)
  // disable buttons based on page number
  if (global.search.page === 1) {
    document.querySelector('#pagination-prev').disabled = true
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#pagination-next').disabled = true
  }

  // Go to page
  document
    .querySelector('#pagination-next')
    .addEventListener('click', async () => {
      global.search.page++
      const { results } = await searchAPIData()
      displayResults(results)
    })

  document
    .querySelector('#pagination-prev')
    .addEventListener('click', async () => {
      global.search.page--
      const { results } = await searchAPIData()
      displayResults(results)
    })
}

// Form validation
const showAlert = (message, className = 'error') => {
  const div = document.createElement('div')
  const text = document.createTextNode(message)
  div.classList.add('alert', className)
  div.appendChild(text)
  document.querySelector('#alert').appendChild(div)
  setTimeout(() => div.remove(), 4000)
}

// Display slider movies on homepage
const displaySlider = async () => {
  const { results } = await fetchAPIData('movie/now_playing')
  results.forEach((movie) => {
    const div = document.createElement('div')
    div.classList.add('swiper-slide')
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4><i class="fas fa-star"></i> ${movie.vote_average} / 10</h4>`
    document.querySelector('.swiper-wrapper').appendChild(div)
    initSlider()
  })
}

const initSlider = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  })
}

function init() {
  // Create a simple router
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider()
      displayPopularMovies()
      break
    case '/movie-details.html':
      console.log('details: movie')
      displayMovieDetails()
      break
    case '/search.html':
      search()
      break
    case '/shows.html':
      displayPopularShows()
      break
    case '/tv-details.html':
      displayShowDetails()
      break
    default:
      break
  }
  setActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
