import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.headers.post["Content-Type"] = "application/json";

const App = () => {
  return (
    <Router>
      <div>
        {/* https://www.getwaves.io  */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="top-svg"
        >
          <path
            fill="#489fb5ff"
            fillOpacity="0.6"
            d="M0,0L120,5.3C240,11,480,21,720,64C960,107,1200,181,1320,218.7L1440,256L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
          ></path>
        </svg>
        <div className="top-nav">
          <NavLink exact to="/">
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="bottom-svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#489fb5ff"
            fillOpacity="0.6"
            d="M0,160L120,181.3C240,203,480,245,720,224C960,203,1200,117,1320,74.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          ></path>
        </svg>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
