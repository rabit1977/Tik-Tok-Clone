import { useState } from "react";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";

export default function UnAuthApp() {
  const [isNewUser, setNewUser] = useState(false);
  const [user, setUser] = useState(null);

  return isNewUser ? (
    <SignUp user={user} />
  ) : (
    <LogIn setUser={setUser} setNewUser={setNewUser} />
  );
}
