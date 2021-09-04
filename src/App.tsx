import React from 'react';
import './App.css';
import { AuthProvider } from "./contexts/AuthProvider";
import { TestComponent } from "./TestComponent";

function App() {
  const onClick = () => {
    console.log("kdkd");
    chrome.runtime.sendMessage({ message: 'get_auth_token' });
  }

  const onClick2 = () => {
    chrome.runtime.sendMessage({ message: "logout" })
  }

  const onClick3 = () => {
    chrome.runtime.sendMessage({ message: "call_calendar" })
  }

  const xx = process.env.REACT_APP_GOOGLE_API_KEY;

  return (
    <AuthProvider>
      <button onClick={onClick}>Click me!!!g</button>
      <button onClick={onClick2}>Logout</button>
      <button onClick={onClick3}>Call calendar!!</button>
      <TestComponent />
      <p>{xx}</p>
    </AuthProvider>
  );
}

export default App;
