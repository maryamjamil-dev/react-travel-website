import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faEye } from '@fortawesome/free-solid-svg-icons';
import './css/About.css';
import heroImg from '../assets/maldive.jpg';
import team2 from '../assets/image1.jpeg';
import team1 from '../assets/image2.jpeg';

const team = [
  { name: 'Maryam Jamil', role: 'Lead Frontend Developer', image: team1 },
  { name: 'Syeda Gillani', role: 'UI/UX Designer', image: team2 },
];

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="about-page">
      <Header />

      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,18,34,0.88) 0%, rgba(8,18,34,0.55) 60%, rgba(8,18,34,0.3) 100%), url(${heroImg})`,
        }}
      >
        <div className="about-hero-text">
          <h1>Travel that goes beyond boundaries</h1>
          <p>We don't just plan trips. We build experiences you will still talk about years later.</p>
        </div>
      </section>

      <div className="mv-wrap">
        <section className="mission-vision">
          <div className="mv-card">
            <div className="mv-icon"><FontAwesomeIcon icon={faBullseye} /></div>
            <h3>Our mission</h3>
            <p>To provide accessible, affordable and authentic travel experiences to every explorer in Pakistan and beyond.</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon"><FontAwesomeIcon icon={faEye} /></div>
            <h3>Our vision</h3>
            <p>To become the world's most trusted travel companion by blending technology with a human touch.</p>
          </div>
        </section>
      </div>

      <section className="about-info">
        <div className="about-info-grid">
          <div className="info-content">
            <h2>Who we are</h2>
            <p>
              TravelWorld is more than a travel agency. It is a community of dreamers and explorers, founded
              in 2026 as a Final Year Project with a passion for seamless digital experiences. We bridge the
              gap between complex travel planning and effortless adventures.
            </p>
            <p>
              Our platform is built on innovation, trust and transparency. From the beaches of Bali to the
              mountains of Pakistan, we offer expert-curated tours, real-time assistance and trips planned
              to the last detail. Our goal is to make the world accessible to everyone, one click at a time.
            </p>
          </div>

          <div className="info-stats">
            <div className="s-box"><strong>50+</strong><span>Countries</span></div>
            <div className="s-box"><strong>10k+</strong><span>Community members</span></div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="about-heading">
          <h2>Meet the team</h2>
          <p>The people who designed and built TravelWorld.</p>
        </div>
        <div className="team-grid">
          {team.map((m) => (
            <div className="team-card" key={m.name}>
              <div className="member-img">
                <img src={m.image} alt={`${m.name}, ${m.role}`} loading="lazy" />
              </div>
              <h4>{m.name}</h4>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}