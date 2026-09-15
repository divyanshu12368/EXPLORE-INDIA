import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaceCard } from "../../index";

// Responsive cards-per-view: 1 on mobile, 2 on tablet, 3 on desktop
function useVisibleCount() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setVisible(1);
      else if (w < 1024) setVisible(2);
      else setVisible(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return visible;
}

export default function PlacesSlider({
  places = [],
  title,
  viewAllLink = "/explore",
  viewAllLabel = "View All Places",
}) {
  const visible = useVisibleCount();
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const draggingRef = useRef(false);
  const instantRef = useRef(false); // true = next snap should be an unanimated jump (loop reset)

  const [current, setCurrent] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

  const controls = useAnimation();

  const extendedPlaces =
    places.length > 0 ? [...places, ...places.slice(0, visible)] : [];

  // Measure the actual pixel width of one slide, responsively
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth / visible);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visible, places.length]);

  const snapTo = (index, instant = false) => {
    controls.start({
      x: -index * slideWidth,
      transition: instant
        ? { duration: 0 }
        : { type: "spring", stiffness: 300, damping: 32, mass: 0.9 },
    });
  };

  // Whenever the target slide (or measured width) changes, animate to it.
  // instantRef lets the loop-reset jump skip the spring animation.
  useEffect(() => {
    if (slideWidth === 0) return;
    snapTo(current, instantRef.current);
    instantRef.current = false;
  }, [current, slideWidth]);

  const goNext = () => setCurrent((prev) => prev + 1);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    if (places.length === 0) return;
    intervalRef.current = setInterval(() => {
      if (!draggingRef.current) goNext();
    }, 3500);
  };
  const stopAutoSlide = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [places.length, visible]);

  // Seamless loop: once we've slid onto the cloned tail slides, jump back to
  // the real start with no animation so it looks infinite.
  useEffect(() => {
    if (places.length === 0) return;
    if (current >= places.length) {
      const timeout = setTimeout(() => {
        instantRef.current = true;
        setCurrent(0);
      }, 550);
      return () => clearTimeout(timeout);
    }
  }, [current, places.length]);

  if (places.length === 0) return null;

  const handleDragEnd = (event, info) => {
    draggingRef.current = false;
    const threshold = slideWidth / 4;

    if (info.offset.x < -threshold) {
      setCurrent((prev) => prev + 1);
    } else if (info.offset.x > threshold && current > 0) {
      setCurrent((prev) => prev - 1);
    } else {
      snapTo(current); // not enough movement — spring back to where we were
    }
    startAutoSlide();
  };

  return (
    <section className="bg-[#FFFBF5] px-6 py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-wide"
            style={{ fontFamily: "Georgia, serif", color: "#8A6D3B" }}
          >
            {title}
          </h2>
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
        >
          <motion.div
            className="flex"
            drag="x"
            dragMomentum={false}
            onDragStart={() => {
              draggingRef.current = true;
              stopAutoSlide();
            }}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            {extendedPlaces.map((place, i) => (
              <div
                key={`${place._id}-${i}`}
                className="px-3 box-border flex-shrink-0"
                style={{ width: slideWidth ? `${slideWidth}px` : `${100 / visible}%` }}
              >
                <PlaceCard place={place} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {viewAllLabel}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}