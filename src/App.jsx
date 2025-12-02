
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AllNews from "./components/AllNews";
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<AllNews />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/world" element={<AllNews />} />
          <Route path="/politics" element={<AllNews />} />
          <Route path="/tech" element={<AllNews />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}
export default App;

