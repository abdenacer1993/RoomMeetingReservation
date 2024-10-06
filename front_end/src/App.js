import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Login from "./components/Login/Login";
import SignUp from './components/SignUp/SignUp';
import SalleList from './components/SalleList/SalleList';
import { useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { getAllSalles } from './JS/actions/salleActions';
import { getCurrent } from './JS/actions/userActions';
import AddSalle from './components/AddSalle/AddSalles';
import Reservation from './components/Reservation/Reservation';
import ShowSalle from './components/ShowSalle/ShowSalle';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getAllSalles());
    dispatch(getCurrent());
  }, [dispatch]);
  
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData);
  

  return (
    <div className="App">
      <NavBar />
      
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <SalleList />
              {localStorage.getItem('token') && userData.user.role === "superAdmin" && (
                <Link to="/addSalle">
                  <button>ADD SALLE</button>
                </Link>
              )}
            </div>
          }
        />
        <Route path="/showSalle/:id" element={<ShowSalle />} />
        <Route path="/Calendar" element={<Reservation />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registre" element={<SignUp />} />
        <Route path="/addSalle" element={<AddSalle />} />
      </Routes>
    </div>
  );
}

export default App;
