import s from '../styles/Footer.module.css'


const Footer = () => {
    return (
        <footer className={s.footer}>
            <div className={s.footerContainer}>
                <p className={s.containerText}>
                    Copyright &copy; TrashFormer 2024
                </p>
            </div>
        </footer>
    );
};

export default Footer;
