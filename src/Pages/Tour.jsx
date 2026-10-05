import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faUsers,
  faMapMarkerAlt,
  faShieldAlt,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import './css/Tour.css';
import Footer from '../Components/Footer';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import img1 from '../assets/bali1.jpg';
import img2 from '../assets/dubai.jpg';
import img3 from '../assets/eygpt.jpg';
import img4 from '../assets/spain.jpg';
import img5 from '../assets/switzeland.jpg';
import img6 from '../assets/turkey.jpg';
import img7 from '../assets/maldive.jpg';
import img8 from '../assets/newzealand.jpg';
import img9 from '../assets/paris.jpg';

const tourData = {
  '1': { title: 'Bali Bliss',   location: 'Indonesia',  price: 600,  days: '5 days',  people: '12+', image: img1 },
  '2': { title: 'Dubai Luxury', location: 'UAE',        price: 1000, days: '4 days',  people: '10+', image: img2 },
  '3': { title: 'Egypt',        location: 'Africa',     price: 1500, days: '7 days',  people: '10+', image: img3 },
  '4': { title: 'Spain',        location: 'Europe',     price: 1700, days: '9 days',  people: '12+', image: img4 },
  '5': { title: 'Switzerland',  location: 'Europe',     price: 2000, days: '6 days',  people: '8+',  image: img5 },
  '6': { title: 'Turkey',       location: 'Asia',       price: 1200, days: '10 days', people: '15+', image: img6 },
  '7': { title: 'Maldives',     location: 'South Asia', price: 800,  days: '9 days',  people: '8+',  image: img7 },
  '8': { title: 'New Zealand',  location: 'Oceania',    price: 1200, days: '12 days', people: '6+',  image: img8 },
  '9': { title: 'Paris',        location: 'France',     price: 1500, days: '7 days',  people: '10+', image: img9 },
};

const FALLBACK = { title: 'Dream Destination', location: 'Global', price: 1200, days: '7 days', people: '15+', image: img1 };

const itinerary = [
  { day: 'Day 1', title: 'Arrival and welcome dinner', text: 'Check in and enjoy a relaxed dinner to start the trip.' },
  { day: 'Day 2', title: 'City exploration', text: 'Guided tour through the main historical landmarks.' },
  { day: 'Day 3', title: 'Nature and photography', text: 'Early morning hike followed by scenic photo stops.' },
];

export default function Tour() {
  const { id } = useParams();
  const tour = tourData[id] || FALLBACK;

  const [formData, setFormData] = useState({ name: '', email: '', date: '', guests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type, message }

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const guests = Math.max(1, Number(formData.guests) || 1);
  const total = tour.price * guests;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'tour_bookings'), {
        tourTitle: tour.title,
        tourLocation: tour.location,
        customerName: formData.name,
        customerEmail: formData.email,
        bookingDate: formData.date,
        totalGuests: guests,
        totalPrice: total,
        status: 'Pending',
        timestamp: new Date().toISOString(),
      });
      setStatus({ type: 'success', message: `Thank you, ${formData.name}. Your ${tour.title} booking request is confirmed.` });
      setFormData({ name: '', email: '', date: '', guests: 1 });
    } catch (error) {
      console.error('Error saving booking:', error);
      setStatus({ type: 'error', message: 'Could not save your booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tour-wrapper">
      <Header />

      <section
        className="tour-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.88) 0%, rgba(8,18,34,0.5) 60%, rgba(8,18,34,0.25) 100%), url(${tour.image})`,
        }}
      >
        <div className="tour-hero-inner">
          <p className="tour-place">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {tour.location}
          </p>
          <h1>{tour.title}</h1>
          <div className="tour-hero-facts">
            <div><strong>{tour.days}</strong><span>Duration</span></div>
            <div><strong>{tour.people}</strong><span>Group size</span></div>
            <div><strong>${tour.price}</strong><span>Per person</span></div>
          </div>
        </div>
      </section>

      <div className="tour-content-grid">
        <div className="tour-details-left">
          <div className="info-card">
            <h2>About this trip</h2>
            <p className="description-text">
              From scenic views to local culture, this {tour.days} tour covers the best of {tour.location}.
              Your guide handles transport, tickets and timing, so you can focus on the trip.
            </p>

            <div className="feature-badges">
              <div className="f-badge"><FontAwesomeIcon icon={faClock} /> <span>{tour.days}</span></div>
              <div className="f-badge"><FontAwesomeIcon icon={faUsers} /> <span>Groups of {tour.people}</span></div>
              <div className="f-badge"><FontAwesomeIcon icon={faShieldAlt} /> <span>Safe and secure</span></div>
            </div>

            <h2 className="itinerary-title">Itinerary</h2>
            <div className="itinerary">
              {itinerary.map((step) => (
                <div className="timeline-item" key={step.day}>
                  <span className="time-dot" />
                  <h4>{step.day}: {step.title}</h4>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="tour-booking-right">
          <div className="booking-card">
            <div className="price-header">
              <span className="price-label">Price</span>
              <h2>${tour.price} <span>per person</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="aesthetic-form">
              <div className="input-group">
                <label htmlFor="name">Full name</label>
                <input id="name" type="text" name="name" placeholder="Your name" required value={formData.name} onChange={handleInput} />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" placeholder="you@example.com" required value={formData.email} onChange={handleInput} />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="date">Travel date</label>
                  <input id="date" type="date" name="date" required value={formData.date} onChange={handleInput} />
                </div>
                <div className="input-group">
                  <label htmlFor="guests">Guests</label>
                  <input id="guests" type="number" name="guests" min="1" value={formData.guests} onChange={handleInput} />
                </div>
              </div>

              <div className="total-row">
                <span>Total for {guests} {guests === 1 ? 'guest' : 'guests'}</span>
                <strong>${total.toLocaleString()}</strong>
              </div>

              <button type="submit" className="confirm-btn" disabled={submitting}>
                {submitting ? 'Booking...' : 'Confirm booking'}
              </button>

              {status && (
                <p className={`status-msg ${status.type}`} role="status">
                  <FontAwesomeIcon icon={status.type === 'success' ? faCheckCircle : faExclamationCircle} />
                  {status.message}
                </p>
              )}
            </form>

            <p className="card-footer-text">No payment needed now. You pay at the destination.</p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}