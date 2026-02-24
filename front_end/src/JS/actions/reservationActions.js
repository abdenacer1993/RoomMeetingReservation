import Swal from "sweetalert2";
import {
    ADD_RESERVATION_FAIL,
    ADD_RESERVATION_SUCCESS,
    DELETE_RESERVATION_FAIL,
    DELETE_RESERVATION_SUCCESS,
    GET_ALL_RESERVATIONS_FAIL,
    GET_ALL_RESERVATIONS_SUCCESS,
    GET_ONE_RESERVATION_FAIL,
    GET_ONE_RESERVATION_SUCCESS,
    LOADING_RESERVATIONS,
    UPDATE_RESERVATION_FAIL,
    UPDATE_RESERVATION_SUCCESS,
  } from "../constants/reservationConstants";
  import axios from "axios";
import { updateSalletofalse } from "./salleActions";
  
  export const getALLReservations = () => async (dispatch) => {
    dispatch({ type: LOADING_RESERVATIONS });
    try {
      const response = await axios.get("http://localhost:5000/reservations");
      dispatch({
        type: GET_ALL_RESERVATIONS_SUCCESS,
        payload: response.data.reservations,
      });
    } catch (error) {
      dispatch({ type: GET_ALL_RESERVATIONS_FAIL, payload: error });
    }
  };



  export const getALLReservationsbyID = (salleId) => async (dispatch) => {
    dispatch({ type: LOADING_RESERVATIONS });
    try {
        const response = await axios.get(`http://localhost:5000/reservations/${salleId}`);
        dispatch({
            type: GET_ALL_RESERVATIONS_SUCCESS,
            payload: response.data.reservations,
        });
    } catch (error) {
        dispatch({ type: GET_ALL_RESERVATIONS_FAIL, payload: error });
    }
};


  
  
  
  export const addReservation = (newReservation,idRes,dateRes ,navigate) => async (dispatch) => {
    try {
      // Récupérer le token d'autorisation depuis le localStorage
      const token = localStorage.getItem("token");
      
      // Vérifier si le token existe
      if (!token) {
        throw new Error("Token not found ");
      }
      
      // Configurer les en-têtes de la requête avec le token d'autorisation
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Spécifier le type de contenu comme JSON
        }
      };
      
      // Envoyer la requête POST avec les données de la nouvelle réservation
      const response = await axios.post(
        "http://localhost:5000/reservations/addReservation",
        newReservation,
        // dispatch(updateSalletofalse(idRes,dateRes)),
        config
      );
  
      // Si la requête est réussie, dispatcher l'action appropriée et naviguer vers une autre page
      dispatch({ type: ADD_RESERVATION_SUCCESS });
      navigate("/");
      Swal.fire({
        title: "Good job!",
        text: "You reserved the salle!",
        icon: "success"
      });
      
    } catch (error) {
      // En cas d'erreur, dispatcher l'action d'échec avec le message d'erreur
      dispatch({ type: ADD_RESERVATION_FAIL, payload: error.message });
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Reserved!",
        
      });
    }
  };
  
