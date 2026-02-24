import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./cs.css";
import { useDispatch, useSelector } from "react-redux";
import { getALLReservations } from "../../JS/actions/reservationActions";
import { getAllSalles } from "../../JS/actions/salleActions";
import { Helmet } from "react-helmet-async";


// Calendar limits
const START_DATE = new Date("2000-12-28");
const END_DATE = new Date("2040-01-30");

export default function Reservation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ REDUX DATA
  const reservations = useSelector(
    (state) => state.reservationReducer?.reservations || []
  );

  const salles = useSelector(
    (state) => state.salleReducer?.salles || []
  );

  // ✅ BACK BUTTON HANDLER
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // ✅ DATE STATE
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  const days = [
    "Dimanche","Lundi","Mardi","Mercredi",
    "Jeudi","Vendredi","Samedi"
  ];

  // ✅ LOAD DATA
  useEffect(() => {
    dispatch(getALLReservations());
    dispatch(getAllSalles());
  }, [dispatch]);

  // ✅ BUILD FULL CALENDAR
  useEffect(() => {
    const dates = [];
    let d = new Date(START_DATE);

    while (d <= END_DATE) {
      dates.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    setCalendar(dates);
  }, []);

  // ✅ FILTER CURRENT MONTH
  useEffect(() => {
    const result = calendar.filter(
      (d) => d.getMonth() === month - 1 && d.getFullYear() === year
    );
    setCurrentMonth(result);
  }, [calendar, month, year]);

  // ✅ GROUP BY WEEK
  const weeks = [];
  for (let i = 0; i < currentMonth.length; i += 7) {
    weeks.push(currentMonth.slice(i, i + 7));
  }

  // ✅ MONTH NAVIGATION
  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Helmet>
        <title>Take Book Salle | Calendar</title>
      </Helmet>
      
      {/* HEADER WITH BACK BUTTON */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2
          }}
        >
          <Button 
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              alignSelf: { xs: "flex-start", sm: "center" }
            }}
          >
            Back
          </Button>
          
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              flex: 1
            }}
          >
            <Button 
              variant="contained" 
              onClick={prevMonth}
              sx={{ minWidth: { xs: 40, sm: 50 } }}
            >
              &lt;
            </Button>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="b" 
              sx={{ 
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {monthNames[month - 1]} {year}
            </Typography>
            <Button 
              variant="contained" 
              onClick={nextMonth}
              sx={{ minWidth: { xs: 40, sm: 50 } }}
            >
              &gt;
            </Button>
          </Box>
          
          <Box sx={{ width: { xs: 40, sm: 50 } }} /> {/* Spacer for balance */}
        </Box>
      </Paper>

      {/* CALENDAR */}
      <Paper sx={{ overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Table sx={{ 
            width: "100%",
            minWidth: { xs: 600, sm: 800, md: 1000 },
            "& .MuiTableCell-root": {
              padding: { xs: 0.5, sm: 1 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" }
            }
          }}>
            <TableHead>
              <TableRow>
                {currentMonth.slice(0, 7).map((d, i) => (
                  <TableCell 
                    key={i} 
                    sx={{ 
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      minWidth: { xs: 85, sm: 120 }
                    }}
                  >
                    {isMobile ? days[d.getDay()].substring(0, 3) : days[d.getDay()]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {weeks.map((week, wi) => (
                <TableRow key={wi}>
                  {week.map((day, di) => {
                    const dayStr = day.toISOString().split("T")[0];

                    // ✅ RESERVATIONS FOR THIS DAY
                    const dayReservations = reservations.filter(
                      (r) => r.dateReservation?.split("T")[0] === dayStr
                    );

                    return (
                      <TableCell
                        key={di}
                        sx={{ 
                          verticalAlign: "top", 
                          minWidth: { xs: 85, sm: 120 },
                          maxWidth: { xs: 100, sm: 150 }
                        }}
                      >
                        {/* DAY NUMBER */}
                        <Box sx={{ 
                          fontWeight: "bold", 
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                          textAlign: "center",
                          mb: 1
                        }}>
                          {day.getDate()}
                        </Box>

                        {/* RESERVATIONS */}
                        {dayReservations.map((res, i) => {
                          const salle = salles.find(
                            (s) => s._id === res.idSalle
                          );

                          return (
                            <Box
                              key={i}
                              sx={{
                                mt: 1,
                                p: { xs: 0.5, sm: 1 },
                                border: "1px solid #ccc",
                                borderRadius: 1,
                                background: "#f5f5f5",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" }
                              }}
                            >
                              {/* NAME */}
                              <Box sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
                                👤 {res.name}
                              </Box>

                              {/* SALLE IMAGE */}
                              {salle?.files?.[0] && (
                                <img
                                  src={salle.files[0]}
                                  alt="Salle"
                                  style={{
                                    width: "100%",
                                    height: { xs: 40, sm: 60 },
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    marginTop: 4
                                  }}
                                />
                              )}
                            </Box>
                          );
                        })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
}
