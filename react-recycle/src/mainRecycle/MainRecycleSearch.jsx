import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MainRecycleSearch = () => {
  const [searchItem, setSearchItem] = useState(""); // 검색할 단어
  const [searchResult, setSearchResult] = useState([]); //검색 결과를 저장
  const [isSearching, setIsSearching] = useState(false);

  const myBackDomain = "http://trashformer.site:8080";

  const onChange = (e) => { // 입력한 단어를 검색할 단어로 바꿔주는 함수
    setSearchItem(e.target.value);
  };

  const searchFilter = searchResult.filter(item =>
    item.mrTag?.toLowerCase().includes(searchItem.toLowerCase())
  )
  // Optional Chaining(?.)를 사용하여 item.mr_tag가 undefined인 경우를 체크하고 트루일 경우 false 값을 보냄

  const onSearch = async () => {
      try {
        const res = await fetch(myBackDomain+`/mainrecycle?query=${searchItem}`,{});
        const data = await res.json();
        console.log(data);
        setSearchResult(data);
      } catch (error) {
        console.error("서버에 연결하는데 실패했습니다.", error);
      }
    };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
    }
  };
  const handleSearchClick = () => {
    setIsSearching(true);
  }
useEffect(()=>{
  if (isSearching){
    onSearch();
    setIsSearching(false);
  }
}, [isSearching]);


  return (
    <div>
      <input
        className="search"
        placeholder="검색어를 입력하세요"
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={searchItem}
      />
      <button onClick={handleSearchClick}>검색</button>
      <ul>
        {searchResult && searchFilter.map((item) => (
          <li key={item.id}>
            <Link to={`/RecycleMain/${item.id}`}>
            <p>{item.mrName}</p>
            <span>{item.mrTag}</span>
            <span>{item.mrCategory}</span>
            <span>{item.mrContent}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )



}

export default MainRecycleSearch;