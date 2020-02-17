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
          <a href="/"><img src="/assets/logo.png" alt="Shakuf logo" className="logo" /></a>
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
          <About />
          <div className="welcome">
            <img src="/assets/circle.png" alt="מחשבון המיסים" />
            <div className="welcome-area">
            <div className="welcome-title">ברוכים.ות הבאים.ות<br/>למחשבון המיסים</div>
            <button className="welcome-button" onClick={() => window.location.href='#calc'}>התחילו כאן >></button>
            </div>
          </div>
          <button className="how-button">לעוד מידע על איך זה עובד לחצו כאן >></button>
          <div className="banner">
            <h2>נמאס לכם מפייק-ניוז?</h2>ֿ
            <h3>
רוצים לקחת חלק, לבחור, להצביע ואפילו להציע מה נחקור?
הצטרפו לצוות המו”לים של שקוף ותקחו חלק במהפחת החדשות של ישראל!
            </h3>
            <button className="shakuf-link" onClick={() => window.location.href = 'https://shakuf.press'}>בקרו אותנו באתר שקוף</button>
          </div>
          <div className="contact">
            <form>
            </form>
          </div>

          <Simple />
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
