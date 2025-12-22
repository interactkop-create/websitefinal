import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Events } from "./pages/Events";
import { UpcomingEvents } from "./pages/UpcomingEvents";
import { Board } from "./pages/Board";
import { News } from "./pages/News";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/AdminLogin";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Admin routes without header/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Public routes with header/footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="events" element={<Events />} />
                  <Route path="upcoming-events" element={<UpcomingEvents />} />
                  <Route path="board" element={<Board />} />
                  <Route path="news" element={<News />} />
                  <Route path="contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;