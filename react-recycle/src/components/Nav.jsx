import { Link } from "react-router-dom";
import styles from '../styles/Nav.module.css';
import Search from "./Search";


const Nav = () => {
    return (
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.center}>
            <h1 className={styles.logo}><Link to="/index.html">My Website</Link></h1>
          </div>
          <div className={styles.center}>
            <Search />
          </div>
          <div className={styles.center}>
            <ul>
              <li><Link to="#" className={styles.current}>Home</Link></li>
              <li><Link to="#">About</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Nav;