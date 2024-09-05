
import PageContents from "./PageContents";
import TopContents from "./TopContents";

const Home = () => {
    return (
        <div className="home" style={{width:'82%'}}>
            <TopContents />
            <PageContents />
        </div>
    );
};

export default Home;