import React from 'react'
import './App.css'
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
        <header>
          <nav className="pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">פתח</a>
          <ul className="pure-menu-list">
            <li className="pure-menu-item"><Link to="/">בית</Link></li>
            <li className="pure-menu-item"><Link to="/about">מה עושים פה</Link></li>
            <li className="pure-menu-item"><Link to="/simple">מחשבון פשוט</Link></li>
            <li className="pure-menu-item"><Link to="/complex">מחשבון מורכב</Link></li>
            <li className="pure-menu-item"><a href="https://shakuf.press">אתר שקוף</a></li>
            <li className="pure-menu-item"><Link to="/contact">יצירת קשר</Link></li>
          </ul>
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
      </Router>
    </div>
  );
}

export default App;
