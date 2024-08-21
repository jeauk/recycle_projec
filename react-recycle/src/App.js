import React, { useState } from 'react';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

function App() {
  const [posts, setPosts] = useState([]); //게시글 배열
  
  const addPost = (post) => {
    setPosts([...posts, { ...post, id: Date.now(), views: 0, recommendCount: 0 }]);
  }; //게시글 추가

  const updatePost = (updatedPost) => {
    setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));
  };
  //id 찾아서 수정

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };
  //id로 삭제 

 const Recommend = (id) => {
    setPosts(posts.map(post => 
       post.id === id ? { ...post, recommendCount: post.recommendCount + 1 } : post
     ));
   };
  // 추천수, 지금 없으면 동작안됨

  const Views = (id) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, views: post.views + 1 } : post
    ));
  };
  // 조회순데 버튼 누를때마다 같이 올라서 수정해야됨

  return (
    <div className="App">
      <h1>게시글</h1>
      <PostForm addPost={addPost} />
      <PostList
        posts={posts}
        updatePost={updatePost}
        deletePost={deletePost}
        Recommend={Recommend}
        Views={Views}
      />
    </div>
  );
}

export default App;