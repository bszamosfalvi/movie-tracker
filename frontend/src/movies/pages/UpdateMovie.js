import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Input from '../../shared/components/form-elements/Input';
import Button from '../../shared/components/form-elements/Button';
import Card from '../../shared/components/ui-elements/Card';
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner';
import ErrorModal from '../../shared/components/ui-elements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './MovieForm.css';

const UpdateMovie = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMovie, setLoadedMovie] = useState();
  const movieId = useParams().movieId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/movies/${movieId}`
        );
        setLoadedMovie(responseData.movie);
        setFormData(
          {
            title: {
              value: responseData.movie.title,
              isValid: true
            },
            description: {
              value: responseData.movie.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchMovie();
  }, [sendRequest, movieId, setFormData]);

  const movieUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:4000/api/movies/${movieId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      navigate('/' + auth.userId + '/movies');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedMovie && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find movie!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedMovie && (
        <form className="movie-form" onSubmit={movieUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedMovie.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedMovie.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE MOVIE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateMovie;
