import Card from "./Card";
import Quiz from "./Quiz";
import TopFiveList from "./TopFiveList";
import Carvon from "./Carvon";
import style from "../styles/Home.module.css";

const Home = () => {

    return (
        <div className={style.home1}>
            <div className={style.t}>
            </div>
            <div className={style.c}>
                <Card />
                <Carvon />
            </div>

            <div className={style.qtc}>
                <TopFiveList />
                <Quiz />
            </div>
        </div>
    );
};

export default Home;