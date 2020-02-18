import  React, {useState, useMemo, FormEvent, useEffect, useCallback} from 'react'
import { Switch, Route, Link, useHistory }from 'react-router-dom'

import { downloadBudget, RawBudgetEntry, fixBudget, BudgetEntry } from './budgetData'
import Results from './results/Results';

const Label = ({children, id}: {children: string, id: string}) => <label htmlFor={id} className="col-sm-2 col-form-label">{children}</label>
const YesNo = ({id, label, disabled, defaultValue, onChange}:
    {id: string, label: string, disabled?: boolean, defaultValue?: boolean, onChange?: (v: boolean) => void}) => <Row label={label} id={id}>
    <select id={id} name={id} disabled={disabled} defaultValue={defaultValue ? 'true' : 'false'} onChange={(e) => onChange && onChange(e.target.value === 'true')}>
    <option value="true">כן</option>
    <option value="false">לא</option>
    </select>
</Row>


const defaultIncome = 7550
const Row = ({children, label, id}: {children: JSX.Element, label: string, id: string}) =>
    <div key={id} className="calc-row">
        <label>{label}</label>
        <div>
            {React.Children.map(children, s => React.cloneElement(s, {id, name: id, className: "form-control"}))}
        </div>
    </div>

// const Output = ({label, value}: {label: string, value: string | number}) =>
//     <div key={label} className="form-group row">
//         <label  className="col-sm-4 col-form-label">{label}</label>
//         <output className="col-sm-4">{value}</output>
//     </div>

const BudgetNodeOutput = ({entry, factor, depth}: {entry: BudgetEntry, factor: number, depth: number}) : JSX.Element =>
    <React.Fragment>
    <div className="budgetEntry">
        <div className="entryTitle">{entry.title}</div>
        <div className="total shekel">{shekel(entry.total_direction_expense)}</div>
        <div className="youSpend shekel">{shekel(entry.total_direction_expense * factor)}</div>
    </div>
    <div className={`sub-budget sub-budget-${depth}`}>
        {entry.children.map(e => <BudgetNodeOutput key={e.code} entry={e} factor={factor} depth={depth + 1} />)}
    </div>
</React.Fragment>


const shekel = (n: number) => `${Number(Math.floor(n)).toLocaleString()} ₪`
//const percent = (n: number) => `${Number(n * 100).toFixed(8)}%`
const Simple = () => {
    const [hasPartner, setHasPartner] = useState<boolean>(false)
    const [income, setIncome] = useState<number>(defaultIncome)
    const [numChildren, setNumChildren] = useState<number>(0)
    const [partnerIncome, setPartnerIncome] = useState<number>(defaultIncome)
    const [sex, setSex] = useState<'m' | 'f'>('f')
    const [rawBudget, setRawBudget] = useState<RawBudgetEntry[]>([])

    useEffect(() => {
        if (rawBudget.length) {
            localStorage.setItem('budget', JSON.stringify(rawBudget))
        }
    }, [rawBudget])
    useEffect(() => {
        const budgetJson = localStorage.getItem('budget')
        if (budgetJson) {
            setRawBudget(JSON.parse(budgetJson))
        } else {
            fetch('/budget-backup.json').then(r => r.json()).then(setRawBudget)
        }
        downloadBudget().then(setRawBudget)
    }, [])


    const budget = useMemo(() => rawBudget && fixBudget(rawBudget), [rawBudget])

    const history = useHistory()
    const submit = useCallback((e: FormEvent) => {
        e.preventDefault()
        history.push('/calc/results')
    }, [history])

    return <Switch>
            <Route exact path="/calc">
            <div className="calc">
        <div className="blue-box">
            <div className="content">
                <h3 className="title-baloon">
                    זה כל כך קל! מסך אחד וסיימנו
                </h3>
                <img src="/assets/arrow.png" className="arrow" alt="arrow" />
            </div>
        </div>
          <div className="grey-box">
            <form onSubmit={submit} className="calc-form">
                    <Row label="מין" id="sex">
                        <select onChange={({target}) => setSex(target.value as 'm' | 'f')} value={sex}>
                        <option value="f">נקבה</option>
                        <option value="m">זכר</option>
                        </select>
                    </Row>
                    <Row label="הכנסה חודשית ממוצעת (כולל קצבאות) ברוטו" id="income">
                        <input type="number" defaultValue={income} onChange={({target}) => setIncome(+target.value)} />
                    </Row>
                    <Row label="שנת לידה" id="birthYear">
                        <select defaultValue="1990">
                            {Array(90).fill(0).map((a, i) => <option key={i}>{1930 + i}</option>)}
                        </select>
                    </Row>
                    <Row label="מספר ילדים" id="numChildren">
                        <select defaultValue={numChildren} onChange={({target}) => setNumChildren(+target.value)}>
                            {Array(12).fill(0).map((a, i) => <option key={i}>{i}</option>)}
                        </select>
                    </Row>
                    <YesNo key="car" label='האם יש ברשותך רכב?' id="car" />
                    <YesNo key="partner" label='האם יש לך בן/בת זוג?' id="partner" defaultValue={hasPartner} onChange={setHasPartner} />
                    <Row label="הכנסה חודשית ממוצעת של בן/בת הזוג (כולל קצבאות) ברוטו" id="partnerIncome">
                        <input type="number" defaultValue={partnerIncome} disabled={!hasPartner} onChange={v => setPartnerIncome(+v)} />
                    </Row>
                    <div className="form-group row">
                    <div className="col-sm-4">
                      <input type="submit" className="blue-button submit" value="שלח" />
                    </div>
                  </div>
                  </form>
            </div>
          <Link to="/about" className=" how-button">לעוד מידע על איך זה עובד לחצו כאן >></Link>
    </div> 

            </Route>
            <Route path="/calc/results">
                <Results hasPartner={hasPartner} sex={sex} numChildren={numChildren} partnerIncome={partnerIncome} income={income} budget={budget} />
            </Route>
        </Switch>
}

export default Simple