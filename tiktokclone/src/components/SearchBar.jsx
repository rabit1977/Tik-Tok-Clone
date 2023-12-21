import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import SearchResults from '../components/SearchResults';
import ClearIcon from '../icons/ClearIcon';
import SearchIcon from '../icons/SearchIcon';
import SmallLoadingIcon from '../icons/SmallLoadingIcon';
import db from '../lib/firebase';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryState, setQueryState] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    setResults([]);
  }, [location.pathname]);

  const searchUsers = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        let usersRef = collection(db, 'users');

        if (queryState) {
          usersRef = query(
            usersRef,
            where('username', '>=', `@${queryState}`),
            where('username', '<', `@${queryState}\uf8ff`),
            orderBy('username'),
            limit(4)
          );

          const result = await getDocs(usersRef);
          const results = result.docs.map((doc) => doc.data());
          setResults(results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [queryState, db]
  );

  useEffect(() => {
    if (queryState.trim().length > 0) {
      searchUsers();
    }
  }, [queryState, searchUsers]);

  const clearInput = useCallback(() => {
    setQueryState('');
    inputRef.current?.focus();
  }, []);

  return (
    <div className='searchbar-container'>
      <form
        className='searchbar-form'
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/search?q=${queryState}`);
        }}
      >
        <input
          ref={inputRef}
          onChange={(e) => setQueryState(e.target.value)}
          value={queryState}
          autoComplete='off'
          placeholder='Search accounts'
          type='text'
          className='searchbar-input'
        />
        <div>
          {queryState && !isLoading && <ClearIcon onClick={clearInput} />}
          {isLoading && <SmallLoadingIcon />}
        </div>
        <span className='searchbar-border'></span>
        <button className='searchbar-icon'>
          <SearchIcon></SearchIcon>
        </button>
      </form>
      <SearchResults results={results} query={queryState} />
    </div>
  );
}
