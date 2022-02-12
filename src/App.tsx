import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import About from "./About";
import Game from "./Game";
import GameWithVirtual from "./GameWithVirtual";
import GameWithoutCube from "./GameWithoutCube";
import Home from "./Home";
import Results from "./Results";

const App = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div>
                <Route exact path='/' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/game' component={Game} />
                <Route path='/gameWithVirtual' component={GameWithVirtual} />
                <Route path='/gameWithoutCube' component={GameWithoutCube} />
                <Route path='/results' component={Results} />
            </div>
        </BrowserRouter>
    )
}

export default App
