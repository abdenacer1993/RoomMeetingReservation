import {
  ADD_SALLE_FAIL,
  DELETE_SALLE_FAIL,
  GET_ALL_SALLES_FAIL,
  GET_ALL_SALLES_SUCCESS,
  GET_ONE_SALLE_FAIL,
  GET_ONE_SALLE_SUCCESS,
  LOADING_SALLES,
  UPDATE_SALLE_FAIL,
} from "../constants/salleConstants";

const initialState = {
  loading: false,
  salles: [],
  errors: null,
  oneSalle: {},
  currentsalles: {},
  
};

export const salleReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    
    case LOADING_SALLES:
      return { ...state, loading: true };
    case GET_ALL_SALLES_SUCCESS:
      return { ...state, salles: payload, loading: false };
    case GET_ALL_SALLES_FAIL:
      return { ...state, loading: false, errors: payload };
    case ADD_SALLE_FAIL:
      return { ...state, errors: payload };
    case DELETE_SALLE_FAIL:
      return { ...state, errors: payload };
    case GET_ONE_SALLE_SUCCESS:
      return { ...state, oneSalle: payload };
    case GET_ONE_SALLE_FAIL:
      return { ...state, errors: payload };
    case UPDATE_SALLE_FAIL:
      return { ...state, errors: payload };
    default:
      return state;
      

  }
};
