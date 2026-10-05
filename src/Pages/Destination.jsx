import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import './css/Destination.css';
import heroImg from '../assets/page.jpg';
import des1 from '../assets/bali1.jpg';
import des2 from '../assets/dubai.jpg';
import des3 from '../assets/eygpt.jpg';
import des4 from '../assets/spain.jpg';
import des5 from '../assets/switzeland.jpg';
import des6 from '../assets/turkey.jpg';
import des7 from '../assets/maldive.jpg';
import des8 from '../assets/newzealand.jpg';
import des9 from '../assets/paris.jpg';
import Footer from '../Components/Footer';

const allData = [
  { id: 1, image: des1, title: 'Bali',        location: 'Indonesia',  price: '600',  rating: '4.9', category: 'Asia' },
  { id: 2, image: des2, title: 'Dubai',       location: 'UAE',        price: '1000', rating: '4.8', category: 'Middle East' },
  { id: 3, image: des3, title: 'Egypt',       location: 'Africa',     price: '1500', rating: '4.9', category: 'Africa' },
  { id: 4, image: des4, title: 'Spain',       location: 'Europe',     price: '1700', rating: '4.6', category: 'Europe' },
  { id: 5, image: des5, title: 'Switzerland', location: 'Europe',     price: '2000', rating: '4.8', category: 'Europe' },
  { id: 6, image: des6, title: 'Turkey',      location: 'Asia',       price: '1200', rating: '5.0', category: 'Asia' },
  { id: 7, image: des7, title: 'Maldives',    location: 'South Asia', price: '800',  rating: '4.9', category: 'Asia' },
  { id: 8, image: des8, title: 'New Zealand', location: 'Oceania',    price: '1200', rating: '4.7', category: 'Asia' },
  { id: 9, image: des9, title: 'Paris',       location: 'France',     price: '1500', rating: '4.6', category: 'Europe' },
];

const CATEGORIES = ['All', 'Europe', 'Asia', 'Africa', 'Middle East'];

export default function Destination() {
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const items = activeFilter === 'All' ? allData : allData.filter((d) => d.category === activeFilter);

  return (
    <div className="destination-page">
      <Header />

      <section
        className="dest-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.88) 0%, rgba(8,18,34,0.55) 60%, rgba(8,18,34,0.3) 100%), url(${heroImg})`,
        }}
      >
        <div className="dest-hero-inner">
          <h1>Find the destination that fits your next trip</h1>
          <p>Browse {allData.length} hand-picked places, compare prices and ratings, and book with TravelWorld.</p>
        </div>
      </section>

      <div className="dest-content-container">
        <div className="filter-bar">
          <p className="result-count" role="status">
            Showing {items.length} {items.length === 1 ? 'destination' : 'destinations'}
          </p>
          <div className="filter-btns" role="group" aria-label="Filter by region">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={activeFilter === cat ? 'active-f' : ''}
                aria-pressed={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="no-results">No destinations in this region yet. Try another filter.</p>
        ) : (
          <div className="dest-grid">
            {items.map((d) => (
              // Change this link if your destination details page uses a different route
              <Link to={`/destination/${d.id}`} className="dest-card" key={d.id}>
                <div className="dest-img">
                  <img src={d.image} alt={d.title} loading="lazy" />
                </div>
                <div className="dest-body">
                  <div className="dest-head">
                    <h3>{d.title}</h3>
                    <span className="dest-rating">
                      <FontAwesomeIcon icon={faStar} /> {d.rating}
                    </span>
                  </div>
                  <p className="dest-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {d.location}
                  </p>
                  <div className="dest-foot">
                    <div className="dest-price">
                      <span>From</span>
                      <strong>${d.price}</strong>
                    </div>
                    <span className="dest-link">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}