import logo from '../../../../img/dark-logo.svg';

import "../../../../public-css/main-style.css";
import "../../../../public-css/artists.css";
import "../../../../public-css/front-style.css";
import "../../../../public-css/minting-form-style.css";
import "../../../../public-css/page-not-found-style.css";
import "../../../../public-css/raffle-example-style.css";

import "../App.css";

const Navbar = () => {
    return(
        <header>
            <div className="logo-container">
                    <img src={logo} alt="dark-logo" className="logo"/>
            </div>
            <nav>
                <ul className="nav-links">
                    <li><a className="nav-link" href="#">ARTISTS</a></li>
                    <li><a className="nav-link" href="#">RAFFLES</a></li>
                    <li><a className="nav-link" href="#">ABOUT</a></li>
                </ul>
            </nav>
        </header>  
    );
}

export default Navbar;