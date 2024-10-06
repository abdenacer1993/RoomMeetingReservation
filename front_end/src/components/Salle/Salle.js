import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { deleteSalle, getOneSalle, updateSalletotrue } from "../../JS/actions/salleActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addReservation, getALLReservationsbyID } from "../../JS/actions/reservationActions";
import Swal from "sweetalert2";
import { CardMedia } from "@mui/material";

export default function Salle({ el }) {
  const userData = JSON.parse(localStorage.getItem('userData'));
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    dispatch(getALLReservationsbyID(el._id));
    if (el.dateReservation === null || new Date(el.dateReservation) < new Date()) {
      dispatch(updateSalletotrue(el._id));
    }
  }, [dispatch, el._id, el.dateReservation]);

  const reservations = useSelector((state) => state.reservationReducer.reservations);
  const idd = reservations.map(reservation => reservation.idSalle);


  let tb = [];
const dat = reservations.map(reservation => reservation.dateReservation);
tb = dat;

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Pad month and day with leading zeros if needed
  month = (month < 10) ? '0' + month : month;
  day = (day < 10) ? '0' + day : day;

  // Return formatted date string in "yyyy-mm-dd" format
  return `${year}-${month}-${day}`;
}
  
const dates = reservations.map(reservation => reservation.dateReservation);

const dateParts = dates.map(date => date.split('T')[0]);

// Modify isReserved function to compare only the date part
const isReserved = (date) => {
  // Extract only the date part (dd/mm/yyyy) from each date in the dates array
  const dateParts = dates.map(date => date.split('T')[0]);

  // Check if the provided date is included in the array of date parts
  return dateParts.includes(date);
  // Example usage

};



  const token = localStorage.getItem("token");

  const [Name, setName] = useState(el.name);
  const [DateReservation, setDateReservation] = useState(getCurrentDate(new Date()));

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("name", Name);
    data.append("dateReservation", DateReservation);
    data.append("user", userData.user._id);
    data.append("idSalle", el._id);

    if (DateReservation === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a date",
      });
    } else {
      dispatch(addReservation(data, el._id, DateReservation, navigate));
    }
  };

  const handleClick = (event) => {
    if (token) {
      handleSubmit(event);
    } else {
      navigate("/login");
    }
  };

  
  

  return (
    <Card style={{ width: 250 , marginBottom:"2%" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={ el.files[0]}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {el.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {el.roomPrice} DT
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Place number: {el.roomSize}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adresse: {el.roomLocalisation}
        </Typography>
        {el.disponible === true && token !== null && userData.user.role === 'user'&&(
          
          
            <div>
              <input
                type="date"
                min={getCurrentDate()}
                value={DateReservation}
                onChange={(e) => setDateReservation(e.target.value)}
                disabled={isReserved(dateParts)}
              /> 
              
            </div>
          
        
        
        )}
        

      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        {userData.user.role === 'superAdmin' ? (
          <div>
            <Button size="small" onClick={() => dispatch(deleteSalle(el._id))}>
              Delete
            </Button>
            
          </div>
        ) : (
          el.disponible === false ? (
            <div>
              <Button style={{ justifyContent: 'center' }} size="small" disabled>
                Book a room
              </Button>
            </div>
          ) : (
            <Button
              style={{ justifyContent: 'center' }}
              size="small"
              onClick={handleClick}
            >
              Book a room
            </Button>
          )
        )}
        <Link to={`/showSalle/${el._id}`}>
              <Button size="small">Details</Button>
            </Link>
      </CardActions>
    </Card>
  );
}