import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import File from "./components/add_tema";
import Get_them from "./components/get_themes"
import Tema_detail from "./components/tema_detail"
import UpdatefromTema from "./components/update_tema"
import Search from "./components/search_tema";
import PageNotFound from "./components/404";
import Cuentas from "./components/cuentas";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Register />}></Route>
          <Route path="/Subir_elemento" element= {<File />}></Route>
          <Route path="/Temas" element= {<Get_them />}></Route>
          <Route path="/Tema/:id" element= {<Tema_detail />}></Route>
          <Route path="/Actualizar-tema/:id" element= {<UpdatefromTema />}></Route>
          <Route path="/search/:q" element={<Search />} />
          <Route path="/Cuentas" element={<Cuentas />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
