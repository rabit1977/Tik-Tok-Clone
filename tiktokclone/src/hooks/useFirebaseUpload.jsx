import { useEffect, useCallback, useReducer } from 'react';
import { nanoid } from 'nanoid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

// Action Types
const SET_FILE = 'SET_FILE';
const SET_UPLOAD_TASK = 'SET_UPLOAD_TASK';
const START_UPLOADING = 'START_UPLOADING';
const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
const SET_VIDEO_URL = 'SET_VIDEO_URL';
const STOP_UPLOADING = 'STOP_UPLOADING';
const RESET_STATE = 'RESET_STATE';

// Initial State
const initialState = {
  file: null,
  uploadTask: null,
  isUploading: false,
  uploadProgress: 0,
  videoUrl: '',
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_FILE:
      return { ...state, file: action.payload };
    case SET_UPLOAD_TASK:
      return { ...state, uploadTask: action.payload };
    case START_UPLOADING:
      return { ...state, isUploading: true };
    case UPDATE_PROGRESS:
      return { ...state, uploadProgress: action.payload };
    case SET_VIDEO_URL:
      return { ...state, videoUrl: action.payload, isUploading: false };
    case STOP_UPLOADING:
      return { ...state, isUploading: false };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Action Creators
const setFile = (file) => ({ type: SET_FILE, payload: file });
const setUploadTask = (uploadTask) => ({
  type: SET_UPLOAD_TASK,
  payload: uploadTask,
});
const startUploading = () => ({ type: START_UPLOADING });
const updateProgress = (progress) => ({
  type: UPDATE_PROGRESS,
  payload: progress,
});
const setVideoUrl = (url) => ({ type: SET_VIDEO_URL, payload: url });
const stopUploading = () => ({ type: STOP_UPLOADING });
const resetState = () => ({ type: RESET_STATE });

// Custom Hook
const useFirebaseUpload = (user) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { file, uploadTask, isUploading, uploadProgress, videoUrl } = state;

  const handleUpload = useCallback(
    (file) => {
      const uploadId = nanoid();
      dispatch(setFile(file));
      const uploadTask = uploadBytesResumable(
        ref(storage, `uploads/${user.uid}/${uploadId}`),
        file
      );
      dispatch(setUploadTask(uploadTask));
      dispatch(startUploading());

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          dispatch(updateProgress(progress));
        },
        (error) => {
          console.error('Error uploading file', error);
          dispatch(stopUploading());
        },
        async () => {
          try {
            const url = await getDownloadURL(
              ref(storage, `uploads/${user.uid}/${uploadId}`)
            );
            dispatch(setVideoUrl(url));
          } catch (error) {
            console.error('Error getting download URL', error);
            dispatch(stopUploading());
          }
        }
      );
    },
    [user]
  );

  const cancelUpload = useCallback(async () => {
    if (uploadTask) {
      dispatch(stopUploading());
      await uploadTask.cancel();
    }
  }, [uploadTask]);

  const discardUpload = useCallback(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    const cleanup = async () => {
      if (uploadTask) {
        await uploadTask.cancel();
      }
    };
    return cleanup;
  }, [uploadTask]);

  return {
    handleUpload,
    cancelUpload,
    discardUpload,
    file,
    videoUrl,
    isUploading,
    uploadProgress,
  };
};

export default useFirebaseUpload;
