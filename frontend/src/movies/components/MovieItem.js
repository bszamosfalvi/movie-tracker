import React, { useState, useContext } from 'react';

import Card from '../../shared/components/ui-elements/Card';
import Button from '../../shared/components/form-elements/Button';
import Modal from '../../shared/components/ui-elements/Modal';
import ErrorModal from '../../shared/components/ui-elements/ErrorModal';
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './MovieItem.css';

const MovieItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/movies/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="movie-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this movie? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="movie-item">
        <Card className="movie-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="movie-item__image">
            <img
              src={`http://localhost:4000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="movie-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>
          <div className="movie-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/movies/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default MovieItem;
