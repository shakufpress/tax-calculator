import  React from 'react'
import { Switch, Route }from 'react-router'

const YesNo = ({name, label}: {name: string, label: string}) => <div className="pure-control-group">
    <label>{label}: <select id={name} name={name}>
    <option value="yes">כן</option>
    <option value="no">לא</option>
    </select></label></div>


const Simple = () => {
    return <Switch>
            <Route exact path="/simple">
                <h2>ברוכים הבאים למחשבון הפשוט</h2>

                <a href="/simple/start">יאללה בואו נתקדם</a>
            </Route>
            <Route path="/simple/start">
                <form className="pure-form" method="get" action="/simple/results">
                    <div key="sex" className="pure-control-group">
                        <label>מין:
                        <select name="sex">
                            <option value="m">זכר</option>
                            <option value="f">נקבה</option>
                        </select>
                        </label>
                    </div>
                    <div key="income" className="pure-control-group">
                        <label> הכנסה חודשית ממוצעת (כולל קצבאות) ברוטו: <input type="number" value="" name="income"></input></label>
                    </div>
                    <div key="by" className="pure-control-group">
                        <label>שנת לידה:
                        <select id="birthYear" value="1990">
                            {Array(90).fill(0).map((a, i) => <option key={i}>{1930 + i}</option>)}
                        </select>
                        </label>
                    </div>
                    <YesNo key="kids" label='האם יש לך ילדים?' name="children" />
                    <YesNo key="car" label='האם יש ברשותך רכב?' name="car" />
                    <YesNo key="partner" label='האם יש לך בן/בת זוג?' name="partner" />
                    <div key="partnerIncome" className="pure-control-group">
                        <label> הכנסה חודשית ממוצעת של בן/בת הזוג (כולל קצבאות) ברוטו: <input type="number" name="partnerIncome"></input></label>
                    </div>
                    <input key="submit" type="submit" value="שלח"></input>                   
                </form>
                </Route>
        </Switch>
}

export default Simple