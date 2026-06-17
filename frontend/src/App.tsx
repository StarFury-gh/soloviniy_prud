import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";
import { MainPage, UserProfile, DevelopmentPage, IdentifyPage } from "./pages";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/development" element={<DevelopmentPage />}></Route>
        <Route path="/identify" element={<IdentifyPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
