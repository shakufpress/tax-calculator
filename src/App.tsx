import React from 'react';
import './App.css';
import { QueryParamProvider } from 'use-query-params';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Home from './Home'
import Simple from './Simple'
import Complex from './Complex'
import About from './About'
import Contact from './Contact'

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <header>
          <img src="/assets/logo.png" alt="Shakuf logo" className="logo" />
          <div className="nav-area">
            <nav>
        <ul className="">
            <li className="nav-item"><Link className="nav-link" to="/about">מה עושים פה</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/calc">מחשבון</Link></li>
            <li className="nav-item"><a className="nav-link" href="https://shakuf.press">אתר שקוף</a></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">יצירת קשר</Link></li>
          </ul>
        </nav>
        </div>
        </header>
      <main>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/about"><About /></Route>
          <Route path="/calc"><Simple /></Route>
          <Route path="/contact"><Contact /></Route>
        </Switch>
      </main>
      <footer>
        <div className="banner">
          הצטרף אלינו
        </div>
      </footer>
      </QueryParamProvider>
      </Router>
    </div>
  );
}

export default App;
