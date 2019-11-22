import  React, {useState, useMemo, FormEvent} from 'react'
import { Switch, Route, Redirect }from 'react-router'
import calcTax from './formulas'

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
        <label  className="col-sm-2 col-form-label">{label}</label>
        <output className="col-sm-2">{value}</output>
    </div>

const shekel = (n: number) => `${Number(Math.floor(n)).toLocaleString()} ₪`

const Simple = () => {
    const [hasPartner, setHasPartner] = useState<boolean>(false)
    const [income, setIncome] = useState<number>(defaultIncome)
    const [numChildren, setNumChildren] = useState<number>(0)
    const [partnerIncome, setPartnerIncome] = useState<number>(defaultIncome)
    const [sex, setSex] = useState<'m' | 'f'>('f')
    const [showResults, setShowResults] = useState<boolean>(false)

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
        taxReduction
    } = useMemo(() => calcTax({hasPartner, sex, numChildren, partnerIncome, income}), [
        hasPartner, sex, numChildren, partnerIncome, income
    ])
    const submit = (e: FormEvent) => {
        e.preventDefault()
        setShowResults(true)
    }

    return <Switch>
            <Route exact path="/simple">
                <h2>ברוכים הבאים למחשבון הפשוט</h2>

                <a href="/simple/start">יאללה בואו נתקדם</a>
            </Route>
            <Route path="/simple/start">
            { showResults ? <Redirect to="/simple/results" /> : 
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
                      <button type="submit" className="btn btn-primary">שלח</button>
                    </div>
                  </div>
                  </form>}
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
            </Route>
        </Switch>
}

export default Simple