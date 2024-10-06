import Swal from "sweetalert2";
import {
  ADD_SALLE_FAIL,
  ADD_SALLE_SUCCESS,
  DELETE_SALLE_FAIL,
  DELETE_SALLE_SUCCESS,
  GET_ALL_SALLES_FAIL,
  GET_ALL_SALLES_SUCCESS,
  GET_ONE_SALLE_FAIL,
  GET_ONE_SALLE_SUCCESS,
  LOADING_SALLES,
  UPDATE_SALLE_FAIL,
  UPDATE_SALLE_SUCCESS,
} from "../constants/salleConstants";
import axios from "axios";



export const getAllSalles = () => async (dispatch) => {
  dispatch({ type: LOADING_SALLES });
  try {
    const response = await axios.get("http://localhost:5000/salles");
    
    dispatch({
      type: GET_ALL_SALLES_SUCCESS,
      payload: response.data.salles,
      
    });
    
  } catch (error) {
    dispatch({ type: GET_ALL_SALLES_FAIL, payload: error });
  }
};


export const getDispSalles = ()  => async (dispatch) => {
  //On récupère les salles disponibles en fonction de la date et heure actuelle
  dispatch({type: LOADING_SALLES});
  try{
    const response = await axios.get("http://localhost:5000/salles/sallesDisp");
    dispatch({
      type: GET_ALL_SALLES_SUCCESS,
      payload: response.data.allSalle,
    });
  }catch(error){
    dispatch({ type: GET_ALL_SALLES_FAIL, payload: error });
  }
};



export const addSalle = (formData, navigate) => async (dispatch) => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem("token");

    // Check if the token exists
    if (!token) {
      throw new Error("Token not found");
    }

    // Configure request headers with the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data for FormData
      }
    };

    // Send POST request to add new salle
    const response = await axios.post(
      "http://localhost:5000/salles/addSalle",
      formData,
      config
    );

    // Log the response from the server
    console.log('Response:', response);

    // Dispatch success action
    dispatch({ type: ADD_SALLE_SUCCESS });

    // Dispatch action to fetch all salles (assuming this action creator is defined elsewhere)
    dispatch(getAllSalles());

    // Navigate to home page
    navigate("/");

  } catch (error) {
    // Log any errors to the console
    console.log('Error:', error);

    // Dispatch error action with specific error message
    dispatch({ type: ADD_SALLE_FAIL, payload: error.message || "Failed to add salle" });

    // Show error message using Swal
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to add salle!"
    });
  }
};




export const deleteSalle = (id, navigate) => async (dispatch) => {
    try {
      const response = await axios.delete(`http://localhost:5000/salles/${id}`);
      dispatch({
        type: DELETE_SALLE_SUCCESS,
      });  
      dispatch(getAllSalles())
      navigate("/")
    } catch (error) {
      dispatch({ type: DELETE_SALLE_FAIL, payload: error });
    }
  };

  
export const getOneSalle = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/salles/${id}`);
    dispatch({
      type: GET_ONE_SALLE_SUCCESS,
      payload: response.data
    }); 
  } catch (error) {
    dispatch({ type: GET_ONE_SALLE_FAIL, payload: error });
  }
};
export const updateOneSalle = (id, newOne, navigate) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:5000/salles/${id}`, newOne);
    dispatch({
      type: UPDATE_SALLE_SUCCESS,
    });      
    dispatch(getAllSalles())
    navigate("/")
  } catch (error) {
    dispatch({ type: UPDATE_SALLE_FAIL, payload: error });
  }
};
export const updateSalletofalse = (id , newddt) => async (dispatch) => {
  try {
    const updatedData = { dateReservation: newddt}; // Les données à mettre à jour
    
    
    const response = await axios.put(`http://localhost:5000/salles/${id}`, updatedData);
    
    dispatch({
      type: UPDATE_SALLE_SUCCESS,
    });

    dispatch(getAllSalles()); // Supposant que getAllSalles() récupère toutes les salles après la mise à jour.

     // Redirection vers la page d'accueil ou une autre page après la mise à jour.
  } catch (error) {
    dispatch({ type: UPDATE_SALLE_FAIL, payload: error });
    
  }
};

export const updateSalletotrue = (id) => async (dispatch) => {
  try {
    const updatedData = { disponible: true }; // Les données à mettre à jour

    const response = await axios.put(`http://localhost:5000/salles/${id}`, updatedData);
    
    dispatch({
      type: UPDATE_SALLE_SUCCESS,
    });

    dispatch(getAllSalles()); // Supposant que getAllSalles() récupère toutes les salles après la mise à jour.

     // Redirection vers la page d'accueil ou une autre page après la mise à jour.
  } catch (error) {
    dispatch({ type: UPDATE_SALLE_FAIL, payload: error });
  }
};
