import './App.css';

import { LoggedInPage } from "./components/LoggedInPage";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <LoggedInPage />
    </AuthProvider>
  );
}

export default App;
