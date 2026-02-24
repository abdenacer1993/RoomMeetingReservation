import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import Footer from "./components/Footer/Footer";
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
  

  return (
    <div className="App">
      <NavBar />
      
      <main style={{ flex: 1 }}>
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
          <Route path="/calendar" element={<Reservation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/addSalle" element={<AddSalle />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
