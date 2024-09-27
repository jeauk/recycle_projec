import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styles from '../styles/MainRecycleDetail.module.css';

const MainRecycleDetail = () => {
    const myBackDomain = process.env.REACT_APP_DOMAIN;
    const { id } = useParams();
    const [item, setItem] = useState(null);
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(myBackDomain+`/mainrecycle/${id}`);
                const data = await res.json();
                console.log(data)
                setItem(data);
            } catch(error){
                console.error("서버에 연결하는데 실패했습니다.", error);
            }
        };
        fetchItem();
    }, [id]);
    
    if(!item) return <p>Loading...</p>;
    return (
        <div className={styles.container}>
            <img src={myBackDomain+item.imgUrl} alt="item image" className={styles.image} />
            <div className={styles.content}>
                <h1 className={styles.title}>{item.mrName}</h1>
                <hr></hr>
                <p className={styles.tag}>태그: {item.mrTag}</p>
                <p className={styles.category}>버리는법: {item.mrCategory}</p>
                <hr></hr>
                <p>{item.mrContent}</p>
            </div>
        </div>
    );
}

export default MainRecycleDetail;