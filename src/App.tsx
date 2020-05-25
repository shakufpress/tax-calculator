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
import About from './About'
import { downloadBudget, RawBudgetEntry, fixBudget } from './budgetData'

const {useState, useMemo, useEffect} = React

const App: React.FC = () => {


    const [rawBudget, setRawBudget] = useState<RawBudgetEntry[]>([])

    const storageKey = `budget-${new Date().getFullYear()}`

    useEffect(() => {
        if (rawBudget.length)
            localStorage.setItem(storageKey, JSON.stringify(rawBudget))
    }, [rawBudget, storageKey])
    useEffect(() => {
        (async () => {
            const budgetJson = localStorage.getItem(storageKey)
            if (budgetJson) {
                setRawBudget(JSON.parse(budgetJson))
            } else {
                const resp = await fetch('/budget-backup.json')
                setRawBudget(await resp.json())
            }

            setRawBudget(await downloadBudget())
        })()
    }, [storageKey])


    const budget = useMemo(() => rawBudget && fixBudget(rawBudget), [rawBudget])
  
  return (
    <div className="App">
      <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <header>
          <div className="main-title content">

            <a href="/">מחשבון המס של <img src="/assets/logo-short.png" alt="Shakuf logo" style={{verticalAlign: 'bottom'}} height="32" /></a>
          </div>
        </header>
      <main>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route exact path="/about"><About /></Route>
          <Route path="/calc"><Simple budget={budget} /></Route>
        </Switch>
      </main>
      <div className="newsletter">
        <div className="newsletter-info">
        <h2>כל התחקירים - אחת לשבועיים, בלי ספאם.</h2>
        <h1>הניוזלטר של <img alt="Shakuf" src="/assets/Shakuf-Logo-Main-Transparent-White-Website.png" /></h1>
        <form>
        </form>
        </div>
        <img src="/assets/desktop.png" alt="desktop" className="desktop-only" />
      </div>
      <footer>
        <a href="https://shakuf.press">לאתר <img src="/assets/shakuf-white.png" alt="Shakuf" /></a>
      </footer>
      </QueryParamProvider>
      </Router>
    </div>
  );
}

export default App;
