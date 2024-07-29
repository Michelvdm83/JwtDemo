import { useState, useEffect } from 'react';
import './App.css';
import useAuthentication from './hooks/useAuthentication';
import AuthForm from './components/authform/AuthForm';

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const {login, logout, register, getUsername, isLoggedIn} = useAuthentication();

  useEffect(() => {
    setCurrentUser(getUsername());
  }, [loggedIn]);

  function trueLogin(username, password){
    login(username, password).then(succes => {
      setLoggedIn(a => succes);
    });
  }

  function trueLogout(){
    logout();
    setLoggedIn(isLoggedIn());
  }

  return (
    <div className='my-page'>
      <AuthForm onSubmitClick={trueLogin} title="login" />
      {loggedIn && <><h1>{currentUser}</h1> <button onClick={() => trueLogout() }>logout</button></>}
      <AuthForm onSubmitClick={register} title="register" />
    </div>);
}

export default App
