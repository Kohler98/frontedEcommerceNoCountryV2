import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export default function Carousel() {
  const slideData = [
    {
      id: 1,
      link: "/product/fae33db7-5308-4714-a151-96b51e3136ec",
      image: "/assets/discount1.png",
    },
    {
      id: 2,
      link: "/product/90a42337-b7aa-4f5f-a110-9666d0ade22c",
      image: "/assets/discount2.png",
    },
    {
      id: 3,
      link: "/product/get/laptops",
      image: "/assets/discount3.png",
    },
  ];

  return (
    <div className="bg-gray-800">
      <Swiper
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={500}
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.link}>
              <div className="hidden lg:flex flex-col items-center shadow-md ">
                <img src={slide.image} alt={`Slide ${slide.id}`} />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
