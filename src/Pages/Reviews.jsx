import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './css/Review.css';
import heroImg from '../assets/dubai.jpg';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Average', 4: 'Very good', 5: 'Excellent' };

const Stars = ({ value }) => (
  <span className="rev-stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <FontAwesomeIcon key={n} icon={faStar} className={n <= value ? '' : 'off'} />
    ))}
  </span>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Zainab Ali', rating: 5, comment: 'Amazing experience with TravelWorld! Highly recommended.', date: 'March 10, 2026' },
    { id: 2, name: 'Usman Khan', rating: 4, comment: 'The tour was great, but the hotel could be better. Overall 8/10.', date: 'Feb 25, 2026' },
  ]);

  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [posted, setPosted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([
      {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString(),
      },
      ...reviews,
    ]);
    setNewReview({ name: '', comment: '', rating: 5 });
    setPosted(true);
  };

  return (
    <div className="reviews-page">
      <Header />

      <section
        className="reviews-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.88) 0%, rgba(8,18,34,0.55) 60%, rgba(8,18,34,0.3) 100%), url(${heroImg})`,
        }}
      >
        <div className="reviews-hero-inner">
          <h1>What travellers say about their trips</h1>
          <p>Honest feedback from people who have travelled with TravelWorld.</p>
          <div className="reviews-summary">
            <div><strong>{average} / 5</strong><span>Average rating</span></div>
            <div><strong>{reviews.length}</strong><span>{reviews.length === 1 ? 'Review' : 'Reviews'}</span></div>
          </div>
        </div>
      </section>

      <div className="reviews-container">
        <div className="reviews-grid">
          {reviews.map((rev) => (
            <article className="review-card-modern" key={rev.id}>
              <Stars value={rev.rating} />
              <p className="rev-text">{rev.comment}</p>
              <div className="rev-header">
                <span className="user-avatar" aria-hidden="true">{rev.name.charAt(0).toUpperCase()}</span>
                <div className="rev-header-text">
                  <h4>{rev.name}</h4>
                  <span className="rev-date">{rev.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="add-review-box">
          <h3>Share your experience</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="rev-name">Your name</label>
            <input
              id="rev-name"
              type="text"
              placeholder="Your name"
              required
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />

            <span className="field-title" id="rating-label">Your rating</span>
            <div className="star-picker" role="radiogroup" aria-labelledby="rating-label">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={newReview.rating === n}
                  aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                  className={n <= newReview.rating ? 'on' : ''}
                  onClick={() => setNewReview({ ...newReview, rating: n })}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
              ))}
              <span className="rating-text">{RATING_LABELS[newReview.rating]}</span>
            </div>

            <label htmlFor="rev-comment">Your review</label>
            <textarea
              id="rev-comment"
              placeholder="Tell others about your trip"
              required
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />

            <button type="submit" className="submit-rev-btn">Post review</button>

            {posted && (
              <p className="status-msg success" role="status">
                <FontAwesomeIcon icon={faCheckCircle} /> Thank you. Your review is now on the page.
              </p>
            )}
          </form>
        </aside>
      </div>

      <Footer />
    </div>
  );
}