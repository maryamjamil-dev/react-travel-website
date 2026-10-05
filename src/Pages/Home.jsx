import React, { useState } from 'react';
import Header from '../Components/Header';
import homeImg from '../assets/hero.jpg';
import './css/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPaperPlane,
  faSearch,
  faExchangeAlt,
  faCalendarAlt,
  faShieldAlt,
  faHeadset,
  faTags,
  faCheckCircle,
  faExclamationCircle,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import des1 from '../assets/bali.jpg';
import des5 from '../assets/switzeland.jpg';
import des6 from '../assets/turkey.jpg';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const destinations = [
  { id: '1', title: 'Bali', location: 'Indonesia, Asia', price: '600', rating: '4.9', image: des1 },
  { id: '5', title: 'Switzerland', location: 'Europe', price: '2000', rating: '4.8', image: des5 },
  { id: '6', title: 'Turkey', location: 'Western Asia', price: '1200', rating: '5.0', image: des6 },
];

const features = [
  {
    icon: faTags,
    title: 'Clear pricing',
    text: 'The price you see includes taxes and fees. No surprises at checkout.',
  },
  {
    icon: faShieldAlt,
    title: 'Secure booking',
    text: 'Your payment and personal details are encrypted and never shared.',
  },
  {
    icon: faHeadset,
    title: 'Help any time',
    text: 'Our travel team answers by chat or phone, before and during your trip.',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(null); // { type, message }
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    returnDate: '',
    tripType: 'Round Trip',
    passengers: '1 Passenger',
    class: 'Business',
  });

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSwap = () => {
    setSearchData({ ...searchData, from: searchData.to, to: searchData.from });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.from || !searchData.to || !searchData.departure) {
      setSearchStatus({
        type: 'error',
        message: 'Enter where you are leaving from, where you are going, and a departure date.',
      });
      return;
    }
    setLoading(true);
    setSearchStatus(null);
    try {
      await addDoc(collection(db, 'bookings'), {
        from: searchData.from,
        to: searchData.to,
        departureDate: searchData.departure,
        returnDate: searchData.tripType === 'Round Trip' ? searchData.returnDate : '',
        tripType: searchData.tripType,
        passengers: searchData.passengers,
        travelClass: searchData.class,
        timestamp: new Date().toISOString(),
      });
      setSearchStatus({ type: 'success', message: 'Trip details saved. We will be in touch shortly.' });
    } catch (error) {
      console.error('Firebase Error:', error);
      setSearchStatus({
        type: 'error',
        message: 'Could not save your trip. Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  };

  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState(null);
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: newsEmail,
        subscribedAt: new Date().toISOString(),
      });
      setNewsStatus({ type: 'success', message: 'Subscribed. Check your inbox for your 20% code.' });
      setNewsEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      setNewsStatus({ type: 'error', message: 'Could not subscribe. Please try again.' });
    }
  };

  return (
    <div className="home-main">
      <Header />

      {/* HERO */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.88) 0%, rgba(8,18,34,0.55) 55%, rgba(8,18,34,0.25) 100%), url(${homeImg})`,
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Book the trip you keep talking about.</h1>
          <p className="hero-subtitle">
            Flights, stays and local experiences in 500+ destinations, all planned in one place with TravelWorld.
          </p>
          <Link to="/destination" className="hero-btn">
            Browse destinations
          </Link>
          <div className="hero-facts">
            <div><strong>4.9 / 5</strong><span>Average rating</span></div>
            <div><strong>12k+</strong><span>Travellers served</span></div>
            <div><strong>500+</strong><span>Destinations</span></div>
          </div>
        </div>
      </section>

      {/* BOOKING PANEL */}
      <div className="booking-wrap">
        <form className="booking-container" onSubmit={handleSearch} noValidate>
          <div className="booking-top-filters">
            <label>
              <span className="sr-only">Trip type</span>
              <select name="tripType" onChange={handleChange} value={searchData.tripType}>
                <option value="Round Trip">Round trip</option>
                <option value="One Way">One way</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Passengers</span>
              <select name="passengers" onChange={handleChange} value={searchData.passengers}>
                <option value="1 Passenger">1 passenger</option>
                <option value="2 Passengers">2 passengers</option>
                <option value="Family">Family</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Travel class</span>
              <select name="class" onChange={handleChange} value={searchData.class}>
                <option value="Business">Business</option>
                <option value="Economy">Economy</option>
                <option value="First Class">First class</option>
              </select>
            </label>
          </div>

          <div className="booking-search-bar">
            <label className="input-box">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" />
              <span className="field-text">
                <span className="field-label">From</span>
                <input type="text" name="from" placeholder="City or airport" value={searchData.from} onChange={handleChange} />
              </span>
            </label>

            <button type="button" className="swap-icon" onClick={handleSwap} aria-label="Swap origin and destination">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </button>

            <label className="input-box">
              <FontAwesomeIcon icon={faPaperPlane} className="field-icon" />
              <span className="field-text">
                <span className="field-label">To</span>
                <input type="text" name="to" placeholder="City or airport" value={searchData.to} onChange={handleChange} />
              </span>
            </label>

            <label className="input-box">
              <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" />
              <span className="field-text">
                <span className="field-label">Depart</span>
                <input type="date" name="departure" value={searchData.departure} onChange={handleChange} />
              </span>
            </label>

            {searchData.tripType === 'Round Trip' && (
              <label className="input-box">
                <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" />
                <span className="field-text">
                  <span className="field-label">Return</span>
                  <input
                    type="date"
                    name="returnDate"
                    min={searchData.departure}
                    value={searchData.returnDate}
                    onChange={handleChange}
                  />
                </span>
              </label>
            )}

            <button type="submit" className="search-btn" disabled={loading}>
              <FontAwesomeIcon icon={faSearch} />
              <span>{loading ? 'Saving...' : 'Search'}</span>
            </button>
          </div>

          {searchStatus && (
            <p className={`status-msg ${searchStatus.type}`} role="status">
              <FontAwesomeIcon icon={searchStatus.type === 'success' ? faCheckCircle : faExclamationCircle} />
              {searchStatus.message}
            </p>
          )}
        </form>
      </div>

      {/* DESTINATIONS */}
      <section className="featured-section">
        <div className="section-title">
          <h2>Popular destinations this season</h2>
          <p>Hand-picked places travellers rate highest, with trips ready to book.</p>
        </div>
        <div className="dest-grid">
          {destinations.map((d) => (
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
        <div className="section-cta">
          <Link to="/destination" className="link-btn">
            See all destinations
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-section">
        <div className="section-title">
          <h2>Why book with TravelWorld</h2>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <div className="feature-icon">
                <FontAwesomeIcon icon={f.icon} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="newsletter" style={{ '--news-bg': `url(${des1})` }}>
        <div className="newsletter-content">
          <h2>Take 20% off your first trip</h2>
          <p>Join the newsletter for deals and travel ideas. We send one email a week at most.</p>
          <form className="news-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              required
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
            />
            <button type="submit">Get my code</button>
          </form>
          {newsStatus && (
            <p className={`status-msg on-dark ${newsStatus.type}`} role="status">
              {newsStatus.message}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}