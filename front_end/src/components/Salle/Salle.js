import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardMedia,
  Box
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { deleteSalle } from "../../JS/actions/salleActions";
import {
  addReservation,
  getALLReservationsbyID
} from "../../JS/actions/reservationActions";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function Salle({ el }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData") || "null");
  const token = localStorage.getItem("token");

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [dateReservation, setDateReservation] = useState(getCurrentDate());

  const reservations =
    useSelector((state) => state.reservationReducer?.reservations) || [];

  useEffect(() => {
    if (el?._id) {
      dispatch(getALLReservationsbyID(el._id));
    }
  }, [dispatch, el?._id]);

  const reservedDates = reservations
    .map((r) => r?.dateReservation?.split("T")[0])
    .filter(Boolean);

  const isReserved = (date) => reservedDates.includes(date);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token || !userData?.user) {
      navigate("/login");
      return;
    }

    if (isReserved(dateReservation)) {
      Swal.fire("Unavailable", "This date is already reserved", "warning");
      return;
    }

    const data = new FormData();
    data.append("name", el.name);
    data.append("dateReservation", dateReservation);
    data.append("user", userData.user._id);
    data.append("idSalle", el._id);

    dispatch(addReservation(data, el._id, dateReservation, navigate));
  };

  return (
    <Card
      sx={{
        width: 350,
        borderRadius: 2,
        boxShadow: 6,
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)" }
      }}
    >
      {/* IMAGE / CAROUSEL */}
      {el?.files?.length > 1 ? (
        <Carousel
          autoPlay={false}
          navButtonsAlwaysVisible
          indicators={false}
        >
          {el.files.map((img, i) => (
            <CardMedia
              key={i}
              component="img"
              height="260"
              image={img}
              alt={`Salle ${i}`}
            />
          ))}
        </Carousel>
      ) : (
        <CardMedia
          component="img"
          height="160"
          image={el?.files?.[0] || "/no-image.png"}
          alt={el?.name}
        />
      )}

      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {el?.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          📍 {el?.roomLocalisation}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2">💺 {el?.roomSize}</Typography>
          <Typography variant="body2" fontWeight="bold">
            💰 {el?.roomPrice} DT
          </Typography>
        </Box>

        {/* DATE PICKER */}
        {token && userData?.user?.role === "user" && el?.disponible && (
          <Box sx={{ mt: 2 }}>
            <input
              type="date"
              min={getCurrentDate()}
              value={dateReservation}
              onChange={(e) => setDateReservation(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc"
              }}
            />
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        {userData?.user?.role === "superAdmin" ? (
          <Button
            color="error"
            variant="outlined"
            onClick={() => dispatch(deleteSalle(el._id))}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={!el?.disponible || isReserved(dateReservation)}
            onClick={handleSubmit}
          >
            Book
          </Button>
        )}

        <Button
          component={Link}
          to={`/showSalle/${el._id}`}
          variant="text"
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}
