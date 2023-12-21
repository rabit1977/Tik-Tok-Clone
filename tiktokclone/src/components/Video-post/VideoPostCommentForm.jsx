import { useState } from 'react';
import { useAuthUser } from '../../context/userContext';
import { EditorState } from 'draft-js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import db from '../../lib/firebase';
import DraftEditor from '../DraftEditor';

export default function VideoPostCommentForm({ post }) {
  const [user] = useAuthUser();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [comment, setComment] = useState({ raw: null, characterLength: 0 });

  function addComment() {
    const newComment = {
      text: comment.raw,
      user,
      createdAt: serverTimestamp(),
    };
    // Use addDoc instead of post.ref.collection("comments").add(newComment)
    addDoc(collection(db, 'posts', post.id, 'comments'), newComment);
    setEditorState(EditorState.createEmpty());
  }
  return (
    <div className='vp-comment-form-container'>
      <div className='vp-comment-form-wrapper'>
        <DraftEditor
          editorState={editorState}
          setEditorState={setEditorState}
          onInputChange={setComment}
          maxLength={150}
        />
        <button onClick={addComment} className='vp-comment-form-submit'>
          Post
        </button>
      </div>
    </div>
  );
}
