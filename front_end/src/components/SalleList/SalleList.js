import React from "react";
import { useSelector } from "react-redux";
import Salle from "../Salle/Salle";

const SalleList = () => {
  const salles = useSelector((state) => state.salleReducer.salles);
  
  return (
    <div style={{display:"flex",justifyContent:"space-evenly",flexWrap:"wrap",margin:"20px"}}>
      
      {salles.map((el) => (
        <Salle el={el} key={el._id} />
      ))}
    </div>
  );
};


export default SalleList;
