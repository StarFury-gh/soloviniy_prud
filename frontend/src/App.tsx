import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";
import { MainPage, VolunteerCabinet, DevelopmentPage } from "./pages";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/volunteer" element={<VolunteerCabinet />}></Route>
        <Route path="/development" element={<DevelopmentPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
