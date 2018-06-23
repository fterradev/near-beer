import { RECEIVE_BREWERIES } from './constants';

const receiveBreweries = breweries => ({
  type: RECEIVE_BREWERIES,
  breweries
});

export const fetchBreweries = (radius = 10) => {
  return dispatch => {
    return fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=restaurant&keyword=cervejaria&key=AIzaSyDchVfbHFmTd_XgIAb3E1GM5SWT1u7cvnU`
    )
      .then(data => data.json())
      .then(breweries => dispatch(receiveBreweries(breweries)));
  };
};
