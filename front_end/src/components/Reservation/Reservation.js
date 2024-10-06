import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Table } from '@mui/material';
import "./cs.css";
import { useDispatch, useSelector } from 'react-redux';
import { getALLReservations } from '../../JS/actions/reservationActions';

// Define start and end dates for the calendar
const dateDebutCalendrier = new Date("December 28, 2000");
const dateFinCalendrier = new Date("January 30, 2040");

export default function Reservation() {
    const dispatch = useDispatch();
  
    // Fetch reservations when component mounts
    

    // Get reservations and extract dates and names
    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const dates = reservations.map(reservation => reservation.dateReservation).filter(date => date !== null);
    const names = reservations.map(nms => nms.name);
    console.log(reservations, "Reservation");

    // Extract URLs from dates
    const URL_DB = dates.map(date => date.split('T')[0]);

    // State variables
    const [allRDV, setAllRdv] = useState(URL_DB);
    const [allNames, setAllNames] = useState(names);
    const [annees, setAnnees] = useState();
    const [mois, setMois] = useState();
    const [jour, setJour] = useState();
    const [calendrier, setCalendrier] = useState([]);
    const [currentMonth , setCurrentMonth] = useState([]);
    const [dateChoisi, setDateChoisi] = useState();
    
    // Date formatting options
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const nomMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"];
    const jourDeSemaine = ["Dimanche","Lundi", "Mardi","Mercredi", "Jeudi", "Vendredi", "Samedi"];

    // Move to previous month
    const prevMonth = () => {
        if(mois - 1 === 0){
            setMois(12);
            setAnnees(annees - 1);
        } else {
            setMois(mois - 1);
        }
    }

    // Move to next month
    const nextMonth = () => {
        if(mois + 1 === 13){
            setMois(1);
            setAnnees(annees + 1);
        } else {
            setMois(mois + 1);
        }
    }

    // Move to next year
    const nextYear = () => {
        setAnnees(annees + 1);
    }

    // Move to previous year
    const prevYear = () => {
        setAnnees(annees - 1);
    }

    // Handle day click event
    const dayClick = (a) => {
        setDateChoisi(a.toLocaleDateString('fr-FR',options));
    }
    
    // Update current month based on year and month
    useEffect(() => {
        const result = calendrier.filter(c => (c.getMonth()) === (mois - 1) && c.getFullYear() === annees);
        setCurrentMonth(result);
        setDateChoisi();
    }, [annees, jour, mois]);





    // Initialize component
    useEffect(() => {
        setAllRdv(URL_DB);
        setAllNames(names);
        const date = new Date();
        setMois(date.getMonth() + 1);
        setAnnees(date.getFullYear());
        setJour(date.getDate());
        var r = [];
        while (dateDebutCalendrier <= dateFinCalendrier) {
            r.push(new Date(dateDebutCalendrier.setDate(dateDebutCalendrier.getDate() + 1)));
        }
        setCalendrier(r);
    }, []);

    // Group dates into weeks
    const weeks = [];
    for (let i = 0; i < currentMonth.length; i += 7) {
        weeks.push(currentMonth.slice(i, i + 7));
    }

    useEffect(() => {
        dispatch(getALLReservations());
    }, [dispatch]);

    return (
        <div className="container">
            <div className='row text-center mt-5'>
                <div className="col-md-6">
                    <div className="row text-center">
                        <div className="d-flex justify-content-center">
                            <button className='btn btn-dark prev' onClick={()=> prevMonth()}> &lt; </button>    
                            <b className='mt-2'>{nomMois[mois-1]}</b>
                            <button className='btn btn-dark next' onClick={() => nextMonth()}> &gt; </button>    
                        </div>
                        <div className="mt-2 d-flex justify-content-center">
                            <button className='btn btn-dark prev' onClick={() => prevYear()}> &lt; </button>    
                            <b className='mt-2'>{annees}</b>
                            <button className='btn btn-dark next' onClick={() => nextYear()}> &gt; </button>    
                        </div>
                    </div>
                    <Table bordered>
                        <thead>
                            <tr>
                                {currentMonth.length > 0 && currentMonth.slice(0,7).map(a => {
                                    return <th scope="col">{jourDeSemaine[a.getDay()]}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody className='body-table'>
                            {/* Mapping over weeks to render each row */}
                            {weeks.map((week, index) => (
                                <tr key={index}>
                                    {/* Mapping over days of the week to render cells */}
                                    {week.map((day, idx) => {
                                        // Check if the day has a reservation
                                        const formattedDay = day.toISOString().split('T')[0];
                                        const rdvs = URL_DB.filter(date => date === formattedDay);

                                        // Filter names based on reserved dates
                                        const reservedNames = names.filter((name, i) => rdvs.includes(URL_DB[i]));

                                        // Determine cell style based on reservations and current day
                                        let cellStyle = {};
                                        if (new Date().toLocaleDateString('fr-FR', options) === day.toLocaleDateString('fr-FR', options)) {
                                            cellStyle = { backgroundColor: 'black', color: 'white' };
                                        } else if (rdvs.length > 0) {
                                            cellStyle = { backgroundColor: 'grey' };
                                        }
                                        
                                        // Render cell
                                        return (
                                            <td className='col-md-1 item-tab' key={idx} style={cellStyle} onClick={() => dayClick(day)}>
                                                <div>{day.getDate()}</div>
                                                <div>
                                                    {/* Render names in reserved cells */}
                                                    {reservedNames.map((name, i) => (
                                                        <React.Fragment key={i}>
                                                            <span>{name}</span>
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
