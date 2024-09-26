import { Link } from 'react-router-dom';
import s from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={s.footer}>
            <div className={s.footerMenu}>
                <Link className={s.FMButton} to="/map"><div className={s.footername}>중고/재활용</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/sido"><div className={s.footername}>폐기물 전화번호</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/list"><div className={s.footername}>리폼 게시판</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/carvon/drafting"><div className={s.footername}>탄소중립포인트란?</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/carvon/incentive"><div className={s.footername}>탄소중립포인트 혜택</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/carvon/carvonMethod"><div className={s.footername}>탄소중립포인트 참여방법</div></Link>
                <div className={s.FMButton}>|</div>
                <Link className={s.FMButton} to="/carvon/companyList"><div className={s.footername}>탄소중립포인트 참여기업</div></Link>
            </div>

            <div className={s.copyrightContainer}>
                <p className={s.copyrightText}>
                    Copyright &copy; TrashFormer 2024
                </p>
            </div>
        </footer>
    );
};

export default Footer;
