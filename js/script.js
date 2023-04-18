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
          movie.homepage
            ? `<a
            href="${movie.homepage}"
            target="_blank"
      class="btn">Visit Movie Homepage</a>`
            : null
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
  const API_KEY = 'f2ea09585c04240200255b651d9f228b'
  const API_URL = 'https://api.themoviedb.org/3/'

  showSpinner()
  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
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
      console.log('search')
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
