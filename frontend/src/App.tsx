import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";
import {
  MainPage,
  UserProfile,
  DevelopmentPage,
  IdentifyPage,
  StoriesPage,
  EventsPage,
  GaleryPage,
} from "./pages";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

import { useAuth } from "./hooks";

function App() {
  const auth = useAuth();

  return (
    <Router>
      <Header authStatus={auth.status} />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/development" element={<DevelopmentPage />}></Route>
        <Route path="/identify" element={<IdentifyPage />}></Route>
        <Route path="/stories" element={<StoriesPage />}></Route>
        <Route path="/events" element={<EventsPage />}></Route>
        <Route path="/galery" element={<GaleryPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
