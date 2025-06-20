import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page whenever the route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // or 'smooth'
    console.log(pathname)
  }, [pathname]);

  return null; // this component renders nothing
}