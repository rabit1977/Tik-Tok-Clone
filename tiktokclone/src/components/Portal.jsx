import { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Custom hook to create and append an element
function usePortal() {
  // Create a ref to store the element
  const elRef = useRef();

  // Initialize the element only once
  useEffect(() => {
    // Create a new div element
    elRef.current = document.createElement('div');
    // Append the element to the body
    document.body.appendChild(elRef.current);
    // Return a function to remove the element
    return () => {
      document.body.removeChild(elRef.current);
    };
  }, []);

  // Return the element
  return elRef.current;
}

export default function Portal({ children, className }) {
  // Use the custom hook to get the element
  const el = usePortal();

  // Render the children into the element using ReactDOM.createPortal
  ReactDOM.createPortal(children, el);
}
