const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const fetchMoviePosters = async (movieTitle) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const posterUrls = data.results
        .filter(movie => movie.poster_path) // Ensure there’s a poster path
        .slice(0, 5) // Limit to the first 5 results
        .map(movie => `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      
      console.log(posterUrls);
      return posterUrls;
    } else {
      console.log('No posters found for this movie.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching movie posters:', error);
  }
};

// Example usage:
// fetchMoviePosters('Inception').then(posterUrls => {
//   posterUrls.forEach(url => console.log(url));
// });

export default fetchMoviePosters;
