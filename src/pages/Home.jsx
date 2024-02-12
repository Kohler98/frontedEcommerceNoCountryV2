import React from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from "../components/home/Carousel";
import HomeCards from "../components/home/HomeCards";

export default function Home() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/get/');
  const isSearchPage = new URLSearchParams(location.search).has('termino'); // Updated condition for search

  return (
    <div>
      {!isProductPage && !isSearchPage && <Carousel />} {/* Updated condition */}
      <HomeCards />
    </div>
  );
}
