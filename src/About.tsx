import React from 'react'

const About = ({close}: {close: () => void}) => {
    return  <div className="about-container" onClick={() => close()}>
    <div className="about">
            <h2>לאן הולכים כספי המסים שלי?</h2> 
            <p>
        המחשבון בודק כמה מס משולם ע"י המשתמש בהתאם לנתונים שהזין, ומחלץ מתוכם את החלק היחסי לכל סעיף תקציבי בספר התקציב. הסעיפים התקציביים מחושבים ע"ב ביצוע התקציב בפועל (ולא ספר התקציב כפי שעבר בכנסת) וזאת משום שביצוע התקציב מאפשר תמונה נכונה ושלמה יותר של הנעשה בפועל עם כספי המסים.
        </p>
        <h2>
        באילו מסים אנחנו מתחשבים?
        </h2>
        <p>
        המחשבון מתחשב במסים המהווים את הנתח הגדול ביותר מתוך הכנסות המדינה: מס הכנסה, מע"מ, מס בריאות וביטוח לאומי. מס הכנסה, בריאות וביטוח לאומי מחושבים ישירות בעזרת נתוני המשתמש, מע"מ מחושב בעזרת עיבודי אגף הכלכלן הראשי לסקר הוצאות משקי הבית של הלמ"ס (נתונים על תשלומי מע"מ בהתאם לעשירוני הכנסה). 
        </p>

        <h2>
        מה רלוונטיות הנתונים?
        </h2>
        <p>
        נתוני ביצוע התקציב ומדרגות המס מתייחסים לשנת 2017. עיבודי הכלכלן הראשי למע"מ מתייחסים לסקר הוצאות משקי הבית של שנת 2016 שעובדו בהתאם לשנת 2017.
        </p>
        <h2>
        איזה טעויות עשויות להיות בנתונים?
        </h2>
        <p>
        מערכת המס הישראלית היא סבוכה ומורכבת ממסים, היטלים ואגרות שונות. בחרנו להתייחס רק למסים המשולמים ע"י המשתמש ישירות ומהווים חלק משמעותי מהכנסות הממשלה. לדוגמה לא נכנס לחישוב מס רכב או היטל בלו על הדלק, וזאת משום שלמרות שמדובר בשני מסים מעצבנים (וגבוהים בהשוואה בין לאומית) החלק היחסי שלהם בהכנסות המדינה הוא נמוך. 
        ניתן כמובן לטעון שגם מסים המוטלים על גורמי ייצור במשק (כמו מס חברות, היטלי יצור, היטלי בניה, מס רווחי הון, אגרות וכו') מגולגלים בפועל לצרכנים ומשולמים על ידם. אך המחשבון עוסק רק במיסים המוטלים על המשתמש ישירות.
        </p>
        <h2>
        ביטוח לאומי - האם הוא מס? 
        </h2>
        <p>
        ישנו וויכוח תיאורטי בין כלכלנים האם ביטוח לאומי הוא חלק ממערכת המס. למרות שהוא לא נגבה ע"י רשות המסים, לעתים קרובות מתייחסים אליו כחלק מהכנסות המדינה ובפועל מבוצעות העברות שונות וחוזרות בין חשבונות הביטוח הלאומי לאוצר המדינה ולהפך. על כן החלטנו לכלול את תשלומי הב"ל כחלק מהמסים אותם משלם הפרט.
        </p>
    </div>
    </div>
}

export default About