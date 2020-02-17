import React from 'react'
import {
  Link
} from 'react-router-dom'

const About = () => {
    return  <div className="about">
        <div className="about-start">
            <div className="baloons">
                <div className="baloon1">ברוכות וברוכים הבאים למחשבון המיסים של שקוף!</div>
                <div className="baloon2">לאן הולכים כספי המיסים שלנו?
    כמה כסף אתה משלם על בני עקיבא או השומר הצעיר? כמה את משלמת על רכבת ישראל?
    כמה אנחנו משלמים על חובות המדינה?</div>
                <div className="baloon3">בהתאם לבחירת המו"לים של שקוף, הקמנו מערכת ראשונה מסוגה, שמוציאה
    "קבלה" לכל עובד במשק עם פירוט של
    כמה כסף אנחנו משלמים למדינה, בממוצע - ובעיקר לאן בדיוק הכסף הזה הולך.
                </div>
            </div>
        </div>
          <div className="welcome">
            <img src="/assets/circle.png" alt="מחשבון המיסים" />
            <div className="welcome-area">
            <div className="welcome-title">ברוכים.ות הבאים.ות<br/>למחשבון המיסים</div>
            <Link className="welcome-button" to="/calc">התחילו כאן >></Link>
            </div>
          </div>
          <button className="how-button">לעוד מידע על איך זה עובד לחצו כאן >></button>
    </div> 
    
}
export default About