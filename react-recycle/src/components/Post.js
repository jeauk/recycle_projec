import React, { useState } from 'react';

function Post({ post, updatePost, deletePost, Recommend, Views }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleUpdate = () => {
    const updatedPost = { ...post, title: editedTitle, content: editedContent };
    updatePost(updatedPost);
    setIsEditing(false);
  };

  return (
    <div onClick={() => Views(post.id)}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>조회수: {post.views}</p>
          <p>추천수: {post.recommendCount}</p>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={() => deletePost(post.id)}>삭제</button>
          <button onClick={() => Recommend(post.id)}>추천</button>
        </div>
      )}
    </div>
  );
}

export default Post;