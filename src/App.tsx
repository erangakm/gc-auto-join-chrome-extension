import "./styles/styles.scss"

import { AppHeader } from "./components/AppHeader";
import { AuthProvider } from "./contexts/AuthProvider";
import { EventList } from "./components/EventList";
import { AppFooter } from "./components/AppFooter";

function App() {
  return (
    <AppHeader>
      <AuthProvider>
        <EventList />
        <AppFooter />
      </AuthProvider>
    </AppHeader>
  );
}

export default App;
