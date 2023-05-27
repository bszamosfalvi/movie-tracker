import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MovieList from '../components/MovieList';
import ErrorModal from '../../shared/components/ui-elements/ErrorModal';
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserMovies = () => {
  const [loadedMovies, setLoadedMovies] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/movies/user/${userId}`
        );
        setLoadedMovies(responseData.movies);
      } catch (err) {
      }
    };
    fetchMovies();
  }, [sendRequest, userId]);

  const movieDeletedHandler = deletedMovieId => {
    setLoadedMovies(prevMovies =>
      prevMovies.filter(movie => movie.id !== deletedMovieId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedMovies && (
        <MovieList items={loadedMovies} onDeleteMovie={movieDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserMovies;
