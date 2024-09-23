
import TopContents from "./TopContents";
import Card from "./Card";
import Quiz from "./Quiz";
import TopFIveList from "./TopFiveList";
import Carvon from "./Carvon";


const Home = () => {
   
    return (
        <div className="home" style={{width:'82%'}}>
            <TopContents />
            <Card />
            <Quiz />
            <TopFIveList />
            <Carvon />
        </div>
    );
};

export default Home;