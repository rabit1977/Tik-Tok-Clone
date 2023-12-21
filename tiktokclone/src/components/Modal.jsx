import { useEffect, useRef, useState, useCallback } from 'react';
import Portal from './Portal';

export default function Modal({ open, onClose, children }) {
  const [active, setActive] = useState(false);
  const backdrop = useRef(null);

  const transitionEnd = useCallback(() => setActive(open), [open]);

  const keyHandler = useCallback(
    (e) => {
      if (e.which === 27) onClose();
    },
    [onClose]
  );

  const clickHandler = useCallback(
    (e) => {
      if (e.target === backdrop.current) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const { current } = backdrop;

    if (current) {
      current.addEventListener('transitionend', transitionEnd);
      current.addEventListener('click', clickHandler);
      window.addEventListener('keyup', keyHandler);
    }

    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        setActive(open);
      }, 10);
    }

    return () => {
      if (current) {
        current.removeEventListener('transitionend', transitionEnd);
        current.removeEventListener('click', clickHandler);
      }

      window.removeEventListener('keyup', keyHandler);
    };
  }, [open, onClose, transitionEnd, clickHandler, keyHandler]);

  return (
    <>
      {(open || active) && (
        <Portal>
          <div
            ref={backdrop}
            className={active && open ? 'active backdrop' : 'backdrop'}
          >
            <div className='content modal-content'>{children}</div>
          </div>
        </Portal>
      )}
    </>
  );
}
