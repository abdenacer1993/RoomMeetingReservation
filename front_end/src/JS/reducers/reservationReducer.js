import {
  ADD_RESERVATION_SUCCESS,
    ADD_RESERVATION_FAIL,
    DELETE_RESERVATION_FAIL,
    GET_ALL_RESERVATIONS_FAIL,
    GET_ALL_RESERVATIONS_SUCCESS,
    GET_ONE_RESERVATION_FAIL,
    GET_ONE_RESERVATION_SUCCESS,
    LOADING_RESERVATIONS,
    UPDATE_RESERVATION_FAIL,
  } from "../constants/reservationConstants";
  
  const initialState = {
    loading: false,
    reservations: [],
    errors: null,
    oneReservations: {},
    currentReservation: {},
  };
  
  export const reservationReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case LOADING_RESERVATIONS:
        return { ...state, loading: true };
      case GET_ALL_RESERVATIONS_SUCCESS:
        return { ...state, reservations: payload, loading: false };
      case GET_ALL_RESERVATIONS_FAIL:
        return { ...state, loading: false, errors: payload };
        case ADD_RESERVATION_SUCCESS:
      return { ...state, currentReservation: payload };
      case ADD_RESERVATION_FAIL:
        return { ...state, errors: payload };
      case DELETE_RESERVATION_FAIL:
        return { ...state, errors: payload };
      case GET_ONE_RESERVATION_SUCCESS:
        return { ...state, oneReservations: payload };
      case GET_ONE_RESERVATION_FAIL:
        return { ...state, errors: payload };
      case UPDATE_RESERVATION_FAIL:
        return { ...state, errors: payload };
      default:
        return state;
    }
  };
  