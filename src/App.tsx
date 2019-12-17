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
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item"><Link className="nav-link" to="/">בית</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">מה עושים פה</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/simple">מחשבון פשוט</Link></li>
            <li className="nav-item"><a className="nav-link" href="https://shakuf.press">אתר שקוף</a></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">יצירת קשר</Link></li>
          </ul>
          </div>
        </nav>
        </header>
        <main>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/about"><About /></Route>
          <Route path="/simple"><Simple /></Route>
          <Route path="/complex"><Complex /></Route>
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
