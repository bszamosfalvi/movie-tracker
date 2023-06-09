import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/ui-elements/Avatar';
import Card from '../../shared/components/ui-elements/Card';
import './UserItem.css';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/movies`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:4000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.movieCount} {props.movieCount === 1 ? 'Movie' : 'Movies'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
