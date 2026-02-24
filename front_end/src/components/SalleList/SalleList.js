import React from "react";
import { useSelector } from "react-redux";
import Salle from "../Salle/Salle";
import { Helmet } from "react-helmet-async";
import { Typography, Box } from "@mui/material";


const SalleList = () => {
  const salles = useSelector((state) => state.salleReducer.salles);
  
  return (
    <div style={{display:"flex",justifyContent:"space-evenly",flexWrap:"wrap",margin:"20px"}}>
       <Helmet>
            <title>Take Book Salle | List salle</title>
          </Helmet>
      {salles.length > 0 ? (
        salles.map((el) => (
          <Salle el={el} key={el._id} />
        ))
      ) : (
        <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucune salle disponible
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Revenez plus tard pour voir les nouvelles salles ajoutées.
          </Typography>
        </Box>
      )}
    </div>
  );
};


export default SalleList;
