import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit, // Import limit from 'firebase/firestore'
} from 'firebase/firestore';
import SearchResults from '../components/SearchResults';
import ClearIcon from '../icons/ClearIcon';
import SearchIcon from '../icons/SearchIcon';
import SmallLoadingIcon from '../icons/SmallLoadingIcon';
import db from '../lib/firebase';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function SearchBar() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate replaces useHistory in v6
  const [queryState, setQueryState] = useState(''); // use a different name for useState
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    setResults([]);
  }, [location.pathname]);

  useEffect(() => {
    const searchUsers = debounce(async () => {
      try {
        setLoading(true);
        let usersRef = collection(db, 'users'); // use collection to get a reference to a collection

        if (queryState) {
          // use query to combine multiple queries
          usersRef = query(
            usersRef,
            where('username', '>=', `@${queryState}`),
            where('username', '<', `@${queryState}\uf8ff`),
            orderBy('username'),
            limit(4)
          );

          const result = await getDocs(usersRef); // use getDocs to get a snapshot of the query
          const results = result.docs.map((doc) => doc.data());
          setResults(results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    if (queryState.trim().length > 0) {
      searchUsers();
    }
  }, [queryState, db]);

  function clearInput() {
    setQueryState('');
    inputRef.current?.focus();
  }

  return (
    <div className='searchbar-container'>
      <form
        className='searchbar-form'
        onSubmit={(e) => {
          e.preventDefault();
          // use navigate to programmatically navigate to a path
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
