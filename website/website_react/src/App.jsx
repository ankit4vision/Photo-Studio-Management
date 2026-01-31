import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import OurWorks from './pages/OurWorks';
import About from './pages/About';
import AlbumDetail from './pages/AlbumDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-works" element={<OurWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          {/* Add more routes here as pages are created */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
