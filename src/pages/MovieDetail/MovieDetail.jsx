import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import Spinner from "../../common/spinner/Spinner";
import useFetch from "../../hooks/useFetch";
import {
  addToFav,
  deleteSelectedMovie,
  getFavList,
  getSelectedMovie,
  removeFromFav,
  selectAMovie,
} from "../../movieStore/movies/movieSlice";
import "./movieDetail.css";

function MovieDetail() {
  // for fav star filled | outlined
  const { imdbId } = useParams();
  const apiKey = process.env.REACT_APP_APIKEY;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const fullLink = `${baseUrl}?apikey=${apiKey}&i=${imdbId}&plot=full`;
  const selectedMovie = useSelector(getSelectedMovie);
  const favList = useSelector(getFavList);
  const [starIconClass, setStarIconClass] = useState("");

  const dispatch = useDispatch();

  const { isLoading, error, performFetch } = useFetch(fullLink);

  function toggleAddToFavList() {
    const isInFav = favList.find(
      movie => movie.imdbID === selectedMovie.imdbID
    );
    if (isInFav) {
      dispatch(removeFromFav(selectedMovie));
      setStarIconClass("regular");
    } else {
      dispatch(addToFav(selectedMovie));
      setStarIconClass("solid");
    }
  }

  useEffect(() => {
    performFetch().then(data => {
      dispatch(selectAMovie(data));
    });
    return () => {
      dispatch(deleteSelectedMovie());
    };
  }, []);

  // check if the movie in the fav list to give the right star className
  useEffect(() => {
    if (selectedMovie && favList) {
      const isInFav = favList.find(
        movie => movie.imdbID === selectedMovie.imdbID
      );
      const starStyle = isInFav ? "solid" : "regular";
      setStarIconClass(starStyle);
    }
  }, [selectedMovie]);

  return (
    <>
      <div className="movie-details page-content">
        {isLoading && <Spinner />}
        {error && <Navigate to="404" />}
        {selectedMovie && (
          <>
            <div className="movie-title">
              <h1>{selectedMovie.Title}</h1>
              <h2>
                {selectedMovie.Year} - {selectedMovie.Genre}
              </h2>
            </div>
            <div className="poster">
              <div onClick={toggleAddToFavList}>
                <i className={`fa-${starIconClass} fa-star`}></i>{" "}
                {selectedMovie.imdbRating}
              </div>
              <img src={selectedMovie.Poster} alt="Movie poster" />
            </div>
            <div className="init-info">
              <h3>
                <span>Summery: </span>
                {selectedMovie.Plot}
              </h3>
              <h3>
                <span>Type: </span>
                {selectedMovie.Type}
              </h3>
              <h3>
                <span>Duration: </span>
                {selectedMovie.Runtime}
              </h3>

              <h3>
                <span>Country: </span>
                {selectedMovie.Country}
              </h3>
              <h3>
                <span>Language: </span>
                {selectedMovie.Language}
              </h3>
              <h3>
                <span>Actors: </span>
                {selectedMovie.Actors}
              </h3>
              <button type="button" onClick={toggleAddToFavList}>
                <i className={`fa-${starIconClass} fa-star`}></i>
                {starIconClass === "regular"
                  ? "Add to favorite"
                  : "Remove from favorite"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MovieDetail;
