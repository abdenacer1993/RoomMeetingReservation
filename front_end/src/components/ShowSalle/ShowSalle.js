import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { deleteSalle, getOneSalle, updateSalleToTrue } from "../../JS/actions/salleActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addReservation, getALLReservationsbyID } from "../../JS/actions/reservationActions";
import Swal from "sweetalert2";
import { CardMedia } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ShowSalle() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const oneSalle = useSelector(state => state.salleReducer.oneSalle);
  console.log(oneSalle._id);
  const reservations = useSelector(state => state.reservationReducer.reservations);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getOneSalle(id));
    dispatch(getALLReservationsbyID(id));
  }, [dispatch, id]);

  const isReserved = (date) => {
    const dateParts = reservations.map(reservation => reservation.dateReservation.split('T')[0]);
    return dateParts.includes(date);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    return `${year}-${month}-${day}`;
  };

  const [DateReservation, setDateReservation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("name", oneSalle.name);
    data.append("dateReservation", DateReservation);
    data.append("user", userData.user._id);
    data.append("idSalle", oneSalle._id);

    if (DateReservation === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a date",
      });
    } else {
      dispatch(addReservation(data, oneSalle._id, DateReservation, navigate));
    }
  };

  const handleClick = (event) => {
    if (userData && userData.token) {
      handleSubmit(event);
    } else {
      navigate("/login");
    }
  };

  // Set up settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Card style={{ width: "100%"}}>
      <Slider {...settings}>
        {oneSalle.files && oneSalle.files.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index + 1}`} style={{ width: "100%", height: "400px" }} />
          </div>
        ))}
      </Slider>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {oneSalle.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {oneSalle.roomPrice} DT
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Place number: {oneSalle.roomSize}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adresse: {oneSalle.roomLocalisation}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Description: {oneSalle.roomDescription}
        </Typography>
        {oneSalle.disponible && userData && userData.user && userData.user.role === 'user' && (
          <div>
            <input
              type="date"
              min={getCurrentDate()}
              value={DateReservation}
              onChange={(e) => setDateReservation(e.target.value)}
              disabled={isReserved(DateReservation)}
            />
          </div>
        )}
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        {userData && userData.user && userData.user.role === 'superAdmin' ? (
          <div>


            <Button size="small" onClick={() => dispatch(deleteSalle(oneSalle._id, navigate))}>
              Delete
            </Button>
          </div>
        ) : (
          oneSalle.disponible ? (
            <Button style={{ justifyContent: 'center' }} size="small" onClick={handleClick}>
              Book a room
            </Button>
          ) : (
            <Button style={{ justifyContent: 'center' }} size="small" disabled>
              Book a room
            </Button>
          )
        )}
        
      </CardActions>
    </Card>
  );
}