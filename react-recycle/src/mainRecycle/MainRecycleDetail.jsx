import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

const MainRecycleDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8080/MainRecycle/${id}`);
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
        <div>
            <img src={item.imgUrl}></img>
            <h1>{item.mrName}</h1>
            <p>Tag: {item.mrTag}</p>
            <p>Category: {item.mrCategory}</p>
            <p>{item.mrContent}</p>
        </div>
    )
}

export default MainRecycleDetail;