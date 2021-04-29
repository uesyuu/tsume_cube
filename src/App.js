import React from "react";
import {HashRouter as Router, Route} from "react-router-dom";
import About from "./About";
import Game from "./Game";
import Home from "./Home";
import Results from "./Results";

const App = () => {
    return (
        <Router>
            <div>
                <Route exact path='/' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/game' component={Game} />
                <Route path='/results' component={Results} />
            </div>
        </Router>
    )
}

export default App