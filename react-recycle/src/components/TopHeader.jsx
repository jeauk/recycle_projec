import { Link } from "react-router-dom";

const TopHeader = () => {
    return (
        <header className="header-padding">
            <div className="header-container">
                <Link className="header-text-center" to="/">
                    TrashFormer
                </Link>
            </div>
        </header>
    );
};

export default TopHeader;