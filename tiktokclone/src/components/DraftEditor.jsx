import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import db from '../lib/firebase';
import { insertCharacter } from '../lib/draft-utils';
import { convertToRaw } from 'draft-js';
import { collection } from 'firebase/firestore';

export default function DraftEditor({
  editorState,
  setEditorState,
  onInputChange,
  maxLength = 150,
}) {
  // Use the collection function to create a reference to the users collection
  const usersRef = collection(db, 'users');
  // Use the useCollectionData hook to listen to the collection data, and pass an options object with the idField property
  const [usersCol] = useCollectionData(usersRef, { idField: 'id' });
  const users = usersCol?.map((user) => ({
    ...user,
    name: user.username,
  }));
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(users?.slice(0, 5));

  const editorRef = useRef();

  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onSearchChange = useCallback(
    ({ value }) => {
      setSuggestions(defaultSuggestionsFilter(value, users));
    },
    [users]
  );

  const onMention = useCallback(() => {
    const newEditorState = insertCharacter('@', editorState);
    setEditorState(newEditorState);
  }, [editorState, setEditorState]);

  const handleBeforeInput = useCallback(() => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;

    if (currentContentLength > maxLength - 1) {
      console.log(`You can type max ${maxLength} characters`);

      return 'handled';
    }
  }, [editorState, maxLength]);

  const handlePastedText = useCallback(
    (pastedText) => {
      const contentState = editorState.getCurrentContent();
      const characterLength = contentState.getPlainText().length;

      if (characterLength + pastedText.length > maxLength) {
        console.log(`You can type max ${maxLength} characters`);

        return 'handled';
      }
    },
    [editorState, maxLength]
  );

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;
    const raw = convertToRaw(contentState);
    onInputChange({ raw, characterLength });
  }, [editorState, onInputChange]);

  return (
    <div className='editor-container'>
      <div className='editor-wrapper'>
        <div className='editor-inner'>
          <div
            onClick={() => {
              editorRef.current.focus();
            }}
          >
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
              onSearchChange={onSearchChange}
            />
          </div>
        </div>
      </div>
      <button className='editor-mention-button' onClick={onMention}>
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
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className='entry-container'>
        <div className='entry-container-left'>
          <img src={mention.photoURL} className='entry-avatar' />
        </div>
        <div className='entry-container-right'>
          <div className='entry-text'>
            {mention.name}
            <span className='entry-username'>@{mention.displayName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
