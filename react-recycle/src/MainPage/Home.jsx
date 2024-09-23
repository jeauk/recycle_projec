
import TopContents from "./TopContents";
import Card from "./Card";
import Quiz from "./Quiz";
import TopFiveList from "./TopFiveList";
import Carvon from "./Carvon";


const Home = () => {

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <div className="home" style={{ width: '82%' }}>
                <TopContents />
                <Card />
            </div>

            <div>
                <Quiz />
                <TopFiveList />
                <Carvon />
            </div>
        </div>
    );
};

export default Home;