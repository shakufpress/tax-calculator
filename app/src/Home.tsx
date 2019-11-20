import React from 'react'
import {Link} from 'react-router-dom'
const Home = () => {
    return <React.Fragment>
        <article>
        הסבר כללי
        <Link to="/about">לעוד מידע</Link>
        </article>
    </React.Fragment>
}
export default Home