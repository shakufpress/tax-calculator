import React from 'react';
import './App.css';
import { QueryParamProvider } from 'use-query-params';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Home from './Home'
import Results, {TaxData} from './results/Results'
import { BudgetEntry } from './budgetData';
import { downloadBudget, RawBudgetEntry, fixBudget } from './budgetData'
import calculateTax from './results/formulas'

const {useState, useMemo, useEffect} = React

const defaultIncome = 7550

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
    const [hasPartner, setHasPartner] = useState<boolean>(false)
    const [income, setIncome] = useState<number>(defaultIncome)
    const [numChildren, setNumChildren] = useState<number>(0)
    const [partnerIncome, setPartnerIncome] = useState<number>(defaultIncome)
    const [sex, setSex] = useState<'m' | 'f'>('f')
  

    interface IncomeData {
        hasPartner: boolean;
        sex: 'm' | 'f';
        numChildren: number;
        partnerIncome: number;
        income: number;
        budget: BudgetEntry;
    }

    const tax: TaxData = useMemo(() => calculateTax({sex, hasPartner, numChildren, partnerIncome, income, budget}), [
        sex, hasPartner, numChildren, partnerIncome, income, budget
    ]);


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
          <Route exact path="/"><Home hasPartner={hasPartner} setHasPartner={setHasPartner} setIncome={setIncome} setNumChildren={setNumChildren} setPartnerIncome={setPartnerIncome} setSex={setSex} /></Route>
          <Route path="/results">
              <Results tax={tax} sex={sex} budget={budget} />
          </Route>
        </Switch>
      </main>
      </QueryParamProvider>
      </Router>
      <div className="newsletter">
        <div className="newsletter-info">
        <h2>כל התחקירים - אחת לשבועיים, בלי ספאם.</h2>
        <h1>הניוזלטר של <img alt="Shakuf" src="/assets/Shakuf-Logo-Main-Transparent-White-Website.png" /></h1>
        <form>
          <input type="email" placeholder={'כתובת הדוא"ל שלך'} />
          <input type="submit" value="רשמו אותי" />
        </form>
        </div>
        <img src="/assets/desktop.png" alt="desktop" className="desktop-only" />
      </div>
      <footer>
        <a href="https://shakuf.press">לאתר <img src="/assets/shakuf-white.png" alt="Shakuf" /></a>
      </footer>
    </div>
  );
}

export default App;
