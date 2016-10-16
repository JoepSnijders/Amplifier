import * as types from './types';
import axios from 'axios';
import { API_URL, API_TOKEN } from '../lib/constants';

export function fetchRecipes(args) {
  console.log(args);
  return (dispatch, getState) => {
    return axios({
      method: 'get',
      url: API_URL + '/beers?beer_name=' + args,
      auth: {
        username: API_TOKEN,
      }
    }).then(resp => {
      console.log(resp);
      dispatch(setSearchedRecipes({recipes: resp.data, error: false}));
    }).catch((ex) => {
      console.log(ex);
      dispatch(setSearchedRecipes({recipes: [], error: true}));
    });
  }
}
export function setSearchedRecipes ({recipes, error}){
  return {
    type: types.SET_SEARCHED_RECIPES,
    recipes,
    error
  }
}
export function addRecipe() {
  return {
    type: types.ADD_RECIPE,
  }
}
