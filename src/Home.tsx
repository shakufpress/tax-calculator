import React from 'react'
import {useCallback, FormEvent} from 'react'
import { useHistory } from 'react-router-dom'

const Row = ({children, label, id, style}: {children: JSX.Element, label: string, id: string, style?: any}) =>
    <div key={id} className="calc-row" style={style}>
        <label>{label}</label>
        <div>
            {React.Children.map(children, s => React.cloneElement(s, {id, name: id, className: "form-control"}))}
        </div>
    </div>

type Setter<T> = (value: T) => void

const Home = ({setIncome, setSex, setPartnerIncome, setHasPartner, setNumChildren, hasPartner}: {hasPartner: boolean, setNumChildren: Setter<number>, setIncome: Setter<number>, setSex: Setter<'m' | 'f'>, setPartnerIncome: Setter<number>, setHasPartner: Setter<boolean>}) => {
    const history = useHistory()
    const submit = useCallback((e: FormEvent) => {
        e.preventDefault()
        history.push(`/results`)
    }, [history])

    return  <div className="start">
        <div className="hero strip">
          <div className="content">
          <img src="/assets/calculator.png" className="desktop-only" alt="calculator" height="222" />
          <span>
לאן הולכים כספי המיסים שלנו? כמה כסף אתה משלם על בני עקיבא או השומר הצעיר? כמה את משלמת על רכבת ישראל? כמה אנחנו משלמים על חובות המדינה? 
<p><b>מלאו את הפרטים שלכם ותגלו!</b></p>
 אל דאגה, המידע שלכם אינו נשמר :)        
          </span>
          </div>
        </div>
        <div className="strip">
        <div className="content">
            <form onSubmit={submit} className="calc-form">
              <div className="form-fields">
              <Row label="מין" id="sex">
                  <select onChange={({target}) => setSex(target.value as 'm' | 'f')} placeholder="בחר/י">
                  <option value="f">נקבה</option>
                  <option value="m">זכר</option>
                  </select>
              </Row>
              <Row label="הכנסה חודשית ממוצעת (כולל קצבאות) ברוטו" id="income">
                  <input type="number" onChange={({target}) => setIncome(+target.value)}  placeholder="בחר/י" />
              </Row>
              <Row label="מספר ילדים" id="numChildren">
                  <select onChange={({target}) => setNumChildren(+target.value)}  placeholder="בחר/י">
                      {Array(12).fill(0).map((a, i) => <option key={i}>{i}</option>)}
                  </select>
              </Row>
              <Row label='האם יש לך בן/בת זוג?' id="partner">
                  <select defaultValue={hasPartner ? 'yes' : 'no'} onChange={({target}) => setHasPartner(target.value === "yes")} placeholder="בחר/י">
                    <option value="yes">כן</option>
                    <option value="no" >לא</option>
                  </select>
              </Row>
              <Row style={hasPartner ? {} : {display: 'none'}} label="הכנסה חודשית ממוצעת של בן/בת הזוג (כולל קצבאות) ברוטו" id="partnerIncome" >
                  <input type="number" onChange={v => setPartnerIncome(+v)}  placeholder="בחר/י" />
              </Row>
              </div>
                <input type="submit" className="blue-button submit" value="חשב" />
          </form>
        </div>
        </div>
    </div> 
    
}
export default Home