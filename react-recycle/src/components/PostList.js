import React from 'react';
import Post from './Post';

function PostList({ posts, updatePost, deletePost, Recommend, Views }) {
  return (
    <div>
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          updatePost={updatePost}
          deletePost={deletePost}
          Recommend={Recommend}
          Views={Views}
        />
      ))}
    </div>
  );
}

export default PostList;