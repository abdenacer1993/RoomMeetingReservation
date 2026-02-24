import axios from "axios";
import { GET_CURRENT_FAIL, GET_CURRENT_SUCCESS, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from "../constants/userConstants";
import Swal from 'sweetalert2'


export const register = (newUser, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/register",
      newUser
    );
    dispatch({ type: REGISTER_SUCCESS, payload: response.data.user });
    navigate("/login");
  } catch (error) {
    
    dispatch({ type: REGISTER_FAIL, payload: error });
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email used!",
      
    });
  }
};




// Importez LOGIN_SUCCESS et LOGIN_FAIL si vous ne l'avez pas déjà fait

export const login = (loggedUser, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/login",
      loggedUser
    );

    // Stockez les données de l'utilisateur dans le stockage local
    localStorage.setItem('userData', JSON.stringify(response.data));

    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    navigate("/");
  } catch (error) {
    
    let errorMessage = "Une erreur s'est produite lors de la connexion.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    dispatch({ type: LOGIN_FAIL, payload: errorMessage });
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email or password invalid!",
    });
  }
};



export const getCurrent = () => async (dispatch) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/users/current",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}
      );
      dispatch({ type: GET_CURRENT_SUCCESS, payload: response.data });
      
    } catch (error) {
      
      dispatch({ type: GET_CURRENT_FAIL, payload: error });
    }
  };



export const logout = (navigate) => {
  // Clear stored auth data
  localStorage.removeItem("token");
  localStorage.removeItem("userData");

  // Redirect to login
  navigate("/login");

  // Reset Redux state
  return {
    type: LOGOUT,
  };
};
