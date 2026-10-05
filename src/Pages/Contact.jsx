import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneAlt,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import './css/Contact.css';
import heroImg from '../assets/paris.jpg';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const details = [
  { icon: faPhoneAlt, label: 'Call us', value: '+92 300 1234567', href: 'tel:+923001234567' },
  { icon: faEnvelope, label: 'Email us', value: 'support@travelworld.com', href: 'mailto:support@travelworld.com' },
  { icon: faMapMarkerAlt, label: 'Visit us', value: 'Model Town, Jhang, Punjab' },
  { icon: faClock, label: 'Working hours', value: 'Mon to Sat, 9:00 AM to 6:00 PM' },
];

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type, message }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString(),
        status: 'Unread',
      });
      setStatus({ type: 'success', message: `Thank you, ${formData.name}. Your message has been sent and we will reply by email.` });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ type: 'error', message: 'Could not send your message. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      <section
        className="contact-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.9) 0%, rgba(8,18,34,0.6) 60%, rgba(8,18,34,0.35) 100%), url(${heroImg})`,
        }}
      >
        <div className="contact-hero-inner">
          <h1>Questions about a trip? Talk to our team.</h1>
          <p>Tell us where you want to go and we will help you plan it. We usually reply within one working day.</p>
        </div>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info-sidebar">
            <h3>Contact details</h3>
            {details.map((d) => (
              <div className="info-item" key={d.label}>
                <div className="icon-circle"><FontAwesomeIcon icon={d.icon} /></div>
                <div>
                  <h4>{d.label}</h4>
                  <p>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <h3>Send us a message</h3>

              <div className="contact-field">
                <label htmlFor="c-name">Full name</label>
                <input id="c-name" type="text" name="name" placeholder="Your name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="contact-field">
                <label htmlFor="c-email">Email address</label>
                <input id="c-email" type="email" name="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="contact-field">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" name="message" placeholder="How can we help you?" rows="5" required value={formData.message} onChange={handleChange} />
              </div>

              <button type="submit" className="contact-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send message'}
              </button>

              {status && (
                <p className={`status-msg ${status.type}`} role="status">
                  <FontAwesomeIcon icon={status.type === 'success' ? faCheckCircle : faExclamationCircle} />
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="map-section">
        <iframe
          title="TravelWorld office in Jhang, Punjab"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109158.4636906669!2d72.25701833758117!3d31.272183204990977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39237277b068c2f1%3A0x6b8a8b1a3d922f3!2sJhang%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1711294500000!5m2!1sen!2s"
          width="100%"
          height="420"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>

      <Footer />
    </div>
  );
}