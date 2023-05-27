import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewMovie from "./movies/pages/NewMovie";
import UserMovies from "./movies/pages/UserMovies";
import UpdateMovie from "./movies/pages/UpdateMovie";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
        <Routes>
          <Route path="/" exact="true" element={<Users />}></Route>
          <Route
            path="/:userId/movies"
            exact="true"
            element={<UserMovies />}
          ></Route>
          <Route path="/movies/new" exact="true" element={<NewMovie />}></Route>
          <Route path="/movies/:movieId" element={<UpdateMovie />}></Route>
          <Route path="*" element = {<Navigate to="/" replace/>}></Route>
        </Routes>

    );
  } else {
    routes = (
        <Routes>
          <Route path="/" exact="true" element={<Users />}></Route>
          <Route
            path="/:userId/movies"
            exact="true"
            element={<UserMovies />}
          ></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="*" element = {<Navigate to="/auth" replace/>}></Route>
        </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
