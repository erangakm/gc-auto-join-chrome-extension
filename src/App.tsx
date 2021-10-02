import "./styles/styles.scss"

import { AppHeader } from "./components/AppHeader";
import { LoggedInPage } from "./components/LoggedInPage";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <AppHeader>
      <AuthProvider>
        <LoggedInPage />
      </AuthProvider>
    </AppHeader>
  );
}

export default App;
