import { signOut } from 'firebase/auth';
import { useAuthUser } from '../context/userContext';
import BusinessSuiteIcon from '../icons/BusinessSuiteIcon';
import FeedbackIcon from '../icons/FeedbackIcon';
import GetCoinsIcon from '../icons/GetCoinsIcon';
import LanguageIcon from '../icons/LanguageIcon';
import LogOutIcon from '../icons/LogOutIcon';
import SettingsIcon from '../icons/SettingsIcon';
import ShortcutsIcon from '../icons/ShortcutsIcon';
import ViewProfileIcon from '../icons/ViewProfileIcon';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Dropdown() {
  const [user] = useAuthUser();
  const navigate = useNavigate();

  async function logOut() {
    try {
      await signOut(auth);
      // window.location.reload();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  }

  return (
    <div className='dd-container'>
      <img src='/dropdown-arrow.svg' alt='Arrow' className='dd-arrow' />
      <div className='dd-wrapper'>
        <DropdownOption
          icon={<ViewProfileIcon />}
          text='View profile'
          onClick={() => navigate(`/${user.username}`)}
        />
        <DropdownOption icon={<GetCoinsIcon />} text='Get coins' />
        <DropdownOption icon={<BusinessSuiteIcon />} text='Business suite' />
        <DropdownOption icon={<SettingsIcon />} text='Settings' />
        <DropdownOption icon={<LanguageIcon />} text='English' />
        <DropdownOption icon={<FeedbackIcon />} text='Feedback and help' />
        <DropdownOption icon={<ShortcutsIcon />} text='Keyboard shortcuts' />
        <DropdownOption icon={<LogOutIcon />} text='Log out' onClick={logOut} />
      </div>
    </div>
  );
}

function DropdownOption({ icon, text, onClick, border }) {
  return (
    <div className='dd-option-container' onClick={onClick}>
      {border && <hr className='dd-option-border' />}
      <span className='dd-option'>
        {icon}
        {text}
      </span>
    </div>
  );
}
