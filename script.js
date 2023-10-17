// Get the apikey
const authToken =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWYzZmE3YjA5N2MzMDAwNTk5ZjFkY2NiZTE0NTg3MCIsInN1YiI6IjY1MWMzZjhhMDcyMTY2MDBjNTY4NTBlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._VWSWS8IluGNbhA70sESW9kaTGmmzHsg6vTZwO6gsUE';

// Get the HTML element using DOM
const apiUrl = 'https://api.themoviedb.org/3/search/movie';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchPage = document.getElementById('searchPage');
const resultsPage = document.getElementById('resultsPage');
const moviesList = document.getElementById('moviesList');
const pagination = document.getElementById('pagination');
const home = document.getElementById('home');

//create header object to define headers included in the HTTP request
const headers = new Headers({
  //ask for a JSON response from the server
  Accept: 'application/json',
  Authorization: authToken,
});

//add functuionality to the searchbutton
searchButton.addEventListener('click', () => {
  //retrive the value from the search input
  const query = searchInput.value.trim();
  //check if the query is not an empty string
  if (query !== '') {
    fetchMovies(query);
  }
});

//control the visibility of the search page
function showSearchPage() {
  searchPage.style.display = 'block';
  resultsPage.style.display = 'none';
}

//controls the visibility of the result page
function showResultPage() {
  searchPage.style.display = 'none';
  resultsPage.style.display = 'block';
}


//render a list of movie on the web page
function displayMovies(movies) {
  const moviesList = document.getElementById('moviesList');
  // Clear the previous content
  moviesList.innerHTML = ''; 

  //check if the movie array is empty
  if (movies.length === 0) {
    moviesList.innerHTML = 'No movies found.';
    return;
  }

  movies.forEach((movie) => {
    //create div element for each movie
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    //create img element for each movie
    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    image.alt = movie.title;

    //create an h3 element
    const title = document.createElement('h3');
    title.textContent = movie.title;

    //create p element
    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    //add all created element as a child to the movieDiv
    movieDiv.appendChild(image);
    movieDiv.appendChild(title);
    movieDiv.appendChild(overview);
    moviesList.appendChild(movieDiv);
  });
}

function displayPagination(totalPages, currentPage, query) {
  // Clear the previous content
  pagination.innerHTML = ''; 

  //define the maximum number of page link to display
  const maxPage = 5;

  //calculate the start and end page number to display
  const startPage = Math.max(1, currentPage - Math.floor(maxPage / 2));
  const endPage = Math.min(totalPages, startPage + maxPage - 1);

   //iterates through the page number
  for (let page = startPage; page <= endPage; page++) {
    //create an 'a' element representing a page link for each page
    const pageLink = document.createElement('a');
    pageLink.href = '#'; 
    pageLink.textContent = page;
     
    //check if the current page number is the current page
    if (page === currentPage) {
      pageLink.classList.add('active');
    }

    // Fetch data for the selected page
    pageLink.addEventListener('click', () => {
      fetchMovies(query, page); 
    });
    //append the page link as a child of pagination
    pagination.appendChild(pageLink);
  }
}

// Fetch and display movies
function fetchMovies(query, page = 1) {
  //construct ther URL for the API request
  const url = `${apiUrl}?query=${query}&page=${page}`;

  //a GET request to the url
  fetch(url, {
    method: 'GET',
    // Include request headers
    headers: headers,
  })
    //parse the response to JSON
    .then((response) => response.json())
    .then((data) => {
      //display the fetch movie data
      displayMovies(data.results);
      displayPagination(data.total_pages, page, query);
      //show the result page
      showResultPage();
    })

    //handle any errror during the fetch
    .catch((error) => console.error('Error fetching data:', error));
}
// Go back to search page
home.addEventListener('click', () => {
  showSearchPage();
});

//eventlistener for when the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  showSearchPage();
});
