import React, { useEffect } from 'react';
import Modal from '../components/Modal';
import useDiscardModal from '../context/discardModalContext';

export default function DiscardModal({ onConfirm }) {
  const { isDiscardOpen, closeDiscard } = useDiscardModal();

  useEffect(() => {
    let timeoutId;

    if (isDiscardOpen) {
      // Set a timeout to close the discard modal after 3 seconds
      timeoutId = setTimeout(() => {
        closeDiscard();
      }, 6000);
    }

    // Clear the timeout when the component is unmounted or when the modal is closed
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isDiscardOpen, closeDiscard]);

  return (
    <Modal open={isDiscardOpen} onClose={closeDiscard}>
        <div className='discard-modal-container'>
        <div className='discard-modal-title-container'>
          <div className='discard-modal-title'>Discard this post?</div>
          <div className='discard-modal-subtitle'>
            The video and all edits will be discarded
          </div>
        </div>
        <button className='discard-modal-confirm' onClick={onConfirm}>
          Discard
        </button>
        <button className='discard-modal-discard' onClick={closeDiscard}>
          Continue editing
        </button>
      </div>
    </Modal>
  );
}



/* eslint-disable react/prop-types */
// import Modal from '../components/Modal';
// import useDiscardModal from '../context/discardModalContext';

// export default function DiscardModal({ onConfirm }) {
//   const { isDiscardOpen, closeDiscard } = useDiscardModal();

//   return (
//     <Modal open={isDiscardOpen} onClose={closeDiscard}>
      // <div className='discard-modal-container'>
      //   <div className='discard-modal-title-container'>
      //     <div className='discard-modal-title'>Discard this post?</div>
      //     <div className='discard-modal-subtitle'>
      //       The video and all edits will be discarded
      //     </div>
      //   </div>
      //   <button className='discard-modal-confirm' onClick={onConfirm}>
      //     Discard
      //   </button>
      //   <button className='discard-modal-discard' onClick={closeDiscard}>
      //     Continue editing
      //   </button>
      // </div>
//     </Modal>
//   );
// }
