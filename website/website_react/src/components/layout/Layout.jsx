import { useState, useEffect } from 'react';
import Preloader from '../common/Preloader';
import PointerCursor from '../common/PointerCursor';
import Header from './Header';
import MobileMenu from './MobileMenu';
import AsideInfo from './AsideInfo';
import SearchModal from './SearchModal';
import Footer from './Footer';
import ToTop from '../common/ToTop';
import { useFancybox } from '../../hooks/useFancybox';
import { useWOW } from '../../utils/wow';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initialize Fancybox globally
  useFancybox();

  // Initialize WOW animations
  useWOW();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAsideToggle = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <Preloader />
      <PointerCursor />
      <Header
        onMobileMenuToggle={handleMobileMenuToggle}
        onAsideToggle={handleAsideToggle}
        onSearchToggle={handleSearchToggle}
      />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <AsideInfo isOpen={isAsideOpen} onClose={() => setIsAsideOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="wrapper">{children}</main>
      <Footer />
      <ToTop />
    </>
  );
};

export default Layout;

