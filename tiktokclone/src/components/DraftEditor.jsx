import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  Modifier,
  CompositeDecorator,
} from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import db from '../lib/firebase';

export default function DraftEditor({
  editorState,
  setEditorState,
  onInputChange,
  maxLength = 150,
}) {
  const usersRef = collection(db, 'users');
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(users.slice(0, 5));

  const editorRef = useRef();

  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    if (currentContentLength > maxLength - 1) {
      console.log(`You can type max ${maxLength} characters`);
      return 'handled';
    }

    return 'not-handled';
  };

  const handlePastedText = (pastedText, _, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    if (currentContentLength + pastedText.length > maxLength) {
      console.log(`You can type max ${maxLength} characters`);
      return 'handled';
    }

    return 'not-handled';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
      setSuggestions(usersData.slice(0, 5));
    };

    fetchUsers();
  }, [usersRef]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText('').length;
    const raw = convertToRaw(contentState);
    onInputChange({ raw, characterLength });
  }, [editorState, onInputChange]);

  return (
    <div className='editor-container'>
      <div className='editor-wrapper'>
        <div className='editor-inner' onClick={() => editorRef.current.focus()}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            plugins={plugins}
            ref={editorRef}
            handleBeforeInput={handleBeforeInput}
            handlePastedText={handlePastedText}
          />
          <MentionSuggestions
            entryComponent={Entry}
            open={open}
            onOpenChange={(open) => setOpen(open)}
            suggestions={suggestions || []}
            onSearchChange={({ value }) =>
              setSuggestions(defaultSuggestionsFilter(value, users))
            }
          />
        </div>
      </div>
      <button
        className='editor-mention-button'
        onClick={() => onMention(editorState, setEditorState)}
      >
        <img src='/at-icon.svg' alt='At Icon' className='editor-mention-icon' />
      </button>
      <button className='editor-hashtag-button'>
        <img
          src='/hashtag-icon.svg'
          alt='Hashtag Icon'
          className='editor-hashtag-icon'
        />
      </button>
    </div>
  );
}

function Entry(props) {
  const { mention, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className='entry-container'>
        <div className='entry-container-left'>
          <img src={mention.photoURL} className='entry-avatar' alt='' />
        </div>

        <div className='entry-container-right'>
          <div className='entry-text'>{mention.name}</div>
          <div className='entry-title'>{mention.displayName}</div>
        </div>
      </div>
    </div>
  );
}

function onMention(editorState, setEditorState) {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentWithEntity = currentContent.createEntity(
    'MENTION',
    'IMMUTABLE',
    { name: 'example', id: 1 }
  );
  const entityKey = contentWithEntity.getLastCreatedEntityKey();

  const text = Modifier.replaceText(
    currentContent,
    selection,
    '@',
    undefined,
    entityKey
  );

  const newEditorState = EditorState.push(
    editorState,
    text,
    'insert-characters'
  );

  setEditorState(EditorState.moveFocusToEnd(newEditorState));
}
