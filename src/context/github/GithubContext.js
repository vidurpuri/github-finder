import React, { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const GITHIB_URL = process.env.REACT_APP_GITHIB_URL;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);

  const searchUsers = async (text) => {
    setLoading();

    const header = {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    };

    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(
      `${GITHIB_URL}/search/users?${params}`,
      header
    );

    const data = await response.json();

    dispatch({
      type: 'GET_USERS',
      payload: data.items,
    });
  };

  //GET Single User
  const getUser = async (login) => {
    setLoading();

    const header = {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    };

    const response = await fetch(`${GITHIB_URL}/users/${login}`, header);

    if (response.status === 400) {
      window.location = '/notfound';
    } else {
      const data = await response.json();

      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  //GET User Repos
  const getUserRepos = async (login) => {
    setLoading();

    const header = {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    };

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    });
    const response = await fetch(
      `${GITHIB_URL}/users/${login}/repos?${params}`,
      header
    );

    const data = await response.json();

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  const clearSearch = () => {
    dispatch({
      type: 'CLEAR_SEARCH',
    });
  };

  const setLoading = () =>
    dispatch({
      type: 'SET_LOADING',
    });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearSearch,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
