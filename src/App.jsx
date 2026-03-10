import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Footer } from "./components";
import Dashboard from "./components/admin/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/" element={
          <div className='relative z-0 bg-primary'>
            <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
              <Navbar />
              <Hero />
            </div>
            <About />
            <div id="projects">
              <Works />
            </div>
            <Tech />

            <div id="testimonial">
              <Feedbacks />
            </div>

            <div className='relative z-0'>
              <Contact />
              <StarsCanvas />
              <Footer />
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
