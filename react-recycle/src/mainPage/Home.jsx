
import TopContents from "./TopContents";
import Card from "./Card";
import Quiz from "./Quiz";
import TopFiveList from "./TopFiveList";
import Carvon from "./Carvon";
import style from "../styles/Home.module.css";

const Home = () => {

    return (
        <div className={style.home1}>
            <div className={style.t}>
                <TopContents />
            </div>
            <div className={style.c}>
                <Card />
            </div>

            <div className={style.qtc}>
                <Quiz />
                <TopFiveList />
                <Carvon />
            </div>
        </div>
    );
};

export default Home;