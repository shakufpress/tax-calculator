import  React, {useMemo, useCallback, FormEvent, useEffect} from 'react'
import { Switch, Route, Redirect }from 'react-router'
import { useQueryParam, NumberParam, StringParam } from 'use-query-params'

const Label = ({children, id}: {children: string, id: string}) => <label htmlFor={id} className="col-sm-2 col-form-label">{children}</label>
const YesNo = ({id, label, disabled, defaultValue, onChange}: 
    {id: string, label: string, disabled?: boolean, defaultValue?: boolean, onChange?: (v: boolean) => void}) => <Row label={label} id={id}>
    <select id={id} name={id} disabled={disabled} defaultValue={defaultValue ? 'true' : 'false'} onChange={(e) => onChange && onChange(e.target.value === 'true')}>
    <option value="true">כן</option>
    <option value="false">לא</option>
    </select>
</Row>

const defaultIncome = 7550
const defaultSex = 'f'
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
    const [hasPartner, setHasPartner] = useQueryParam('hasPartner', StringParam)
    useEffect(() => {if (typeof hasPartner === 'undefined') setHasPartner('false') }, [hasPartner, setHasPartner])
    const [income, setIncome] = useQueryParam('income', NumberParam)
    useEffect(() => {if (typeof income === 'undefined') setIncome(defaultIncome) }, [income, setIncome])
    const [numChildren, setNumChildren] = useQueryParam('children', NumberParam)
    useEffect(() => {if (typeof numChildren === 'undefined') setNumChildren(0) }, [numChildren, setNumChildren])
    const [partnerIncome, setPartnerIncome] = useQueryParam('partnerIncome', NumberParam)
    useEffect(() => {if (typeof partnerIncome === 'undefined') setPartnerIncome(defaultIncome) }, [partnerIncome, setPartnerIncome])
    const [sex, setSex] = useQueryParam('sex', StringParam)
    useEffect(() => {if (typeof sex === 'undefined') setSex(defaultSex) }, [sex, setSex])

    const doesHavePartner = useMemo(() => hasPartner === 'true', [hasPartner])

    const bonusPoints = useMemo(() => 2.25 + (sex === 'f' ? 0.5 : 0) + 
        ((sex === 'f' || !doesHavePartner) ? (numChildren || 0) : 0), [sex, !doesHavePartner, numChildren])

    const perBonusPoint = 2580
    const taxReduction = useMemo(() => bonusPoints * perBonusPoint, [bonusPoints])
    const yearlyIncome = useMemo(() => (income || 0) * 12, [income])

    const taxStep = useCallback((v: number) => {
        const steps = [[0, 0], [74640, .1], [107040, .14], [171840, .2], [238800, .31], [496920, .35], [640000, .47], [Infinity, .5]]
        let total = 0
        for (let i = 0; i < steps.length; ++i) {
            const [value, rate] = steps[i]
            if (v <= value) {
                return total + (v - value) * rate
            } else if (i) {
                total += (value - steps[i - 1][0]) * rate
            }
        }

        return Math.max(0, total)
    }, [])
    const taxWithoutReductions = useMemo(() => taxStep(yearlyIncome), [yearlyIncome, taxStep])
    const yearlyPartnerIncome = useMemo(() => (doesHavePartner && partnerIncome) ? partnerIncome * 12 : 0, [doesHavePartner, partnerIncome])
    const incomeTax = useMemo(() => Math.max(0, taxWithoutReductions - taxReduction), [taxWithoutReductions, taxReduction])
    const partnerTax = useMemo(() => Math.max(0, doesHavePartner ? taxStep(yearlyPartnerIncome || 0) - 2.25 * perBonusPoint : 0), [yearlyPartnerIncome, taxStep, doesHavePartner])
    const netAnnualPartnerIncome = useMemo(() => yearlyPartnerIncome ? yearlyPartnerIncome - partnerTax : 0, [yearlyPartnerIncome, partnerTax])
    const netIncome = useMemo(() => yearlyIncome - incomeTax, [yearlyIncome, incomeTax])
    const householdIncome = useMemo(() => netIncome + netAnnualPartnerIncome, [netIncome, netAnnualPartnerIncome])
    const netMonthlyHouseholdIncome = useMemo(() => householdIncome / 12, [householdIncome])
    const decile = useMemo(() => {
        const deciles = [0, 4214, 6558, 8580, 11028, 13323, 16037, 19196, 23274, 29938, Infinity]
        for (let i = 0; i < deciles.length; ++i) {
            if (netMonthlyHouseholdIncome <= deciles[i]) {
                return i
            }
        }
    }, [netMonthlyHouseholdIncome])

    const vatPerDecile = [0, 1190, 1208, 1355, 1606, 1731, 1885, 2014, 2189, 2389, 2920]

    const monthlyVat = useMemo(() => vatPerDecile[decile || 0], [decile, vatPerDecile])
    const householdAnnualVat = useMemo(() => monthlyVat * 12, [monthlyVat])
    const myAnnualVat = useMemo(() => householdAnnualVat / (doesHavePartner ? 2 : 1), [doesHavePartner, householdAnnualVat])
    const totalAnnualTax = useMemo(() => myAnnualVat + Math.max(0, incomeTax), [myAnnualVat, incomeTax])

    const submit = (e: FormEvent) => {
        e.preventDefault()
    }

    return <Switch>
            <Route exact path="/simple">
                <h2>ברוכים הבאים למחשבון הפשוט</h2>

                <a href="/simple/start">יאללה בואו נתקדם</a>
            </Route>
            <Route path="/simple/start">
                <form method="get" action="/simple/results">
                    <Row label="מין" id="sex">
                        <select onChange={({target}) => setSex(target.value)} value={sex}>
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
                    <YesNo key="partner" label='האם יש לך בן/בת זוג?' id="partner" defaultValue={doesHavePartner} onChange={v => setHasPartner(String(v))} />
                    <Row label="הכנסה חודשית ממוצעת של בן/בת הזוג (כולל קצבאות) ברוטו" id="partnerIncome">
                        <input type="number" defaultValue={partnerIncome} disabled={!hasPartner} onChange={v => setPartnerIncome(+v)} />
                    </Row>
                    <div className="form-group row">
                    <div className="col-sm-4">
                      <button type="submit" className="btn btn-primary" onSubmit={submit}>שלח</button>
                    </div>
                  </div>
                  </form>
            </Route>
            <Route path="/simple/results">
                <h3>עיבוד נתונים</h3>
                <Output label="הכנסה שנתית" value={shekel(yearlyIncome)} />
                <Output label="הכנסה נטו שלי (שנתי)" value={shekel(netIncome)} />
                <Output label="הכנסה שנתית של בן/בת הזוג" value={shekel(netAnnualPartnerIncome)} />
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