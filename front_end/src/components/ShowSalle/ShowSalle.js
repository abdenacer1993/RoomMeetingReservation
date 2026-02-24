import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Divider,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneSalle, deleteSalle, updateSalletofalse } from "../../JS/actions/salleActions";
import { addReservation, getALLReservationsbyID } from "../../JS/actions/reservationActions";
import Swal from "sweetalert2";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./custom-dots.css";
import { Helmet } from "react-helmet-async";



const Arrow = ({ className, style, onClick, direction }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      ...style
    }}
  />
);

export default function ShowSalle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const userData = JSON.parse(localStorage.getItem("userData") || "null");

  // ✅ BACK BUTTON HANDLER
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const oneSalle = useSelector(
    (state) => state.salleReducer.oneSalle || {}
  );

  const reservations = useSelector(
    (state) => state.reservationReducer.reservations || []
  );

  useEffect(() => {
    dispatch(getOneSalle(id));
    dispatch(getALLReservationsbyID(id));
  }, [dispatch, id]);

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const isReserved = (date) =>
    reservations
      .map((r) => r.dateReservation?.split("T")[0])
      .includes(date);

  const [dateReservation, setDateReservation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dateReservation) {
      Swal.fire("Error", "Please select a date", "error");
      return;
    }

    const data = new FormData();
    data.append("name", oneSalle.name);
    data.append("dateReservation", dateReservation);
    data.append("user", userData.user._id);
    data.append("idSalle", oneSalle._id);

    dispatch(addReservation(data, oneSalle._id, dateReservation, navigate));
  };

  const handleClick = (e) => {
    userData?.token ? handleSubmit(e) : navigate("/login");
  };


  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    customPaging: function(i) {
      return (
        <button
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            border: "2px solid white",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        />
      );
    },
    dotsClass: "slick-dots custom-dots"
  };

  return (
    <>
     <Helmet>
          <title>Take Book Salle | Details salle</title>
        </Helmet>
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        mb: 4,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
        gap: 4
      }}
    >
      
      <Box sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 6, position: "relative" }}>
        <Slider {...settings}>
          {oneSalle?.files?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Salle ${i}`}
              style={{
                width: "100%",
                height: "420px",
                objectFit: "cover"
              }}
            />
          ))}
        </Slider>
      </Box>

      
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: 4,
          backgroundColor: "white"
        }}
      >
        {/* BACK BUTTON */}
        <Box sx={{ mb: 2 }}>
          <Button 
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>

        <Typography variant="h4" fontWeight="bold">
          {oneSalle.name}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          📍 {oneSalle.roomLocalisation}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {oneSalle.disponible ? (
            <Chip label="Available" color="success" />
          ) : (
            <Chip label="Reserved" color="error" />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1">
          {oneSalle.roomDescription}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>💺 {oneSalle.roomSize} people</Typography>
          <Typography fontWeight="bold">
            💰 {oneSalle.roomPrice} DT
          </Typography>
        </Box>

        
        {oneSalle.disponible && userData?.user?.role === "user" && (
          <Box sx={{ mt: 3 }}>
            <input
              type="date"
              min={getCurrentDate()}
              value={dateReservation}
              onChange={(e) => setDateReservation(e.target.value)}
              disabled={isReserved(dateReservation)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />
          </Box>
        )}

        
        <Box sx={{ mt: 4 }}>
          {userData?.user?.role === "superAdmin" ? (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => dispatch(deleteSalle(oneSalle._id, navigate))}
            >
              Delete room
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!oneSalle.disponible}
              onClick={handleClick}
            >
              Reserve now
            </Button>
          )}
        </Box>
      </Box>
    </Box>
    </>
  );
}
