import  React, {useState, useMemo, FormEvent, useEffect, useCallback} from 'react'
import { Switch, Route, Link, useHistory }from 'react-router-dom'
import calcTax from './formulas'
import { downloadBudget, RawBudgetEntry, fixBudget, BudgetEntry } from './budgetData'
const {Treebeard} = require('react-treebeard')

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
    <div key={id} className="form-group row">
        <Label id={id}>{label}</Label>
        <div className="col-sm-2">
            {React.Children.map(children, s => React.cloneElement(s, {id, name: id, className: "form-control"}))}
        </div>
    </div>

const Output = ({label, value}: {label: string, value: string | number}) =>
    <div key={label} className="form-group row">
        <label  className="col-sm-4 col-form-label">{label}</label>
        <output className="col-sm-4">{value}</output>
    </div>

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
const percent = (n: number) => `${Number(n * 100).toFixed(8)}%`
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


    const {
        totalAnnualTax,
        annualIncome,
        netIncome,
        householdIncome,
        netMonthlyHouseholdIncome,
        decile,
        monthlyVat,
        myAnnualVat,
        taxWithoutReductions,
        householdAnnualVat,
        netAnnualPartnerIncome,
        partnerTax,
        incomeTax,
        annualPartnerIncome,
        bonusPoints,
        personalBudgetFactor,
        taxReduction
    } = useMemo(() => calcTax({hasPartner, sex, numChildren, partnerIncome, income, totalBudget: budget ? budget.total : 0}), [
        hasPartner, sex, numChildren, partnerIncome, income, budget
    ])

    const history = useHistory()
    const submit = useCallback((e: FormEvent) => {
        e.preventDefault()
        history.push('/simple/results')
    }, [history])
    interface TreeNode {
        name: string
        toggled: boolean
        children: TreeNode[]
    }

    const toTreeNode = useCallback((e: BudgetEntry) : TreeNode => ({
        name: `${e.title} : ${shekel(e.total_direction_expense * personalBudgetFactor)}`,
        toggled: true,
        children: (e.children || []).map(toTreeNode)
    }), [personalBudgetFactor])

    const treeBeardData = useMemo(() => ({
        name: 'תקציב המדינה',
        toggled: true,
        children: budget.roots.map(e => toTreeNode(e))
    }), [budget, toTreeNode])

    return <Switch>
            <Route exact path="/simple">
                <h2>ברוכים הבאים למחשבון הפשוט</h2>

                <Link to="/simple/start">יאללה בואו נתקדם</Link>
            </Route>
            <Route path="/simple/start">
            <form onSubmit={submit}>
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
                      <input type="submit" className="btn btn-primary" value="שלח" />
                    </div>
                  </div>
                  </form>
            </Route>
            <Route path="/simple/results">
                <h3>עיבוד נתונים</h3>
                <Output label="הכנסה שנתית" value={shekel(annualIncome)} />
                <Output label="הכנסה נטו שלי (שנתי)" value={shekel(netIncome)} />
                <Output label="הכנסה שנתית של בן/בת הזוג" value={shekel(annualPartnerIncome)} />
                <Output label="מס הכנסה ללא נקודות זיכוי" value={shekel(taxWithoutReductions)} />
                <Output label="מספר נקודות זיכוי" value={bonusPoints} />
                <Output label="הפחת מס בזכות נקודות זיכוי" value={shekel(taxReduction)} />
                <Output label="סה״כ מס הכנסה שנתי" value={shekel(incomeTax)} />
                <Output label="מס שבן הזוג משלם" value={shekel(partnerTax)} />
                <Output label="הכנסה נטו של בן הזוג (שנתי)" value={shekel(netAnnualPartnerIncome)} />
                <Output label="הכנסה נטו למשק הבית" value={shekel(householdIncome)} />
                <Output label="חישוב הכנסה נטו חודשית" value={shekel(netMonthlyHouseholdIncome)} />
                <Output label="עשירון משק הבית" value={decile || 0} />
                <Output label="כמה מע״מ משק הבית משלם בחודש?" value={shekel(monthlyVat)} />
                <Output label="כמה מע״מ משק הבית משלם בשנה?" value={shekel(householdAnnualVat)} />
                <Output label="כמה מע״מ אני משלם בשנה?" value={shekel(myAnnualVat)} />
                <Output label="כמה מס אני משלם בשנה?" value={shekel(totalAnnualTax)} />
                {budget.total ? <div className="withBudget">
                <Output label="פקטור" value={percent(personalBudgetFactor)} />
                <div className="budget">
                    <Treebeard data={treeBeardData} />
                </div>
                </div> : <span>Loading...</span>}
            </Route>
        </Switch>
}

export default Simple