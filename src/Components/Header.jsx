import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/destination', label: 'Destination' },
  { to: '/tour/1', label: 'Tour Packages' },
  { to: '/about', label: 'About' },
  { to: '/review', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

const friendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { pathname } = useLocation();

  // Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  // Lock body scroll when drawer or modal is open
  useEffect(() => {
    document.body.style.overflow = showModal || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal, menuOpen]);

  // ESC closes everything
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setShowModal(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to.split('/').slice(0, 2).join('/')));

  const resetForm = () => {
    setErrors({});
    setFormError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const toggleModal = (type) => {
    setIsSignUp(type === 'signup');
    resetForm();
    setShowModal(true);
    setMenuOpen(false);
  };

  const switchMode = () => {
    setIsSignUp((v) => !v);
    setErrors({});
    setFormError('');
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !formData.name.trim()) newErrors.name = 'Enter your full name';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Enter your email address';
    else if (!emailPattern.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Enter a password';
    else if (formData.password.length < 6) newErrors.password = 'Use at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Firebase logic unchanged; alerts replaced with inline messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, 'users', user.uid), {
          fullName: formData.name,
          email: formData.email,
          uid: user.uid,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Firebase Auth Error:', error.message);
      setFormError(friendlyError(error.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => { signOut(auth); };
  const closeMenu = () => setMenuOpen(false);

  const authButtons = currentUser ? (
    <button className="btnlog" onClick={() => { handleLogout(); closeMenu(); }}>Log out</button>
  ) : (
    <>
      <button className="btnlog" onClick={() => toggleModal('login')}>Log in</button>
      <button className="btnsign" onClick={() => toggleModal('signup')}>Sign up</button>
    </>
  );

  return (
    <>
      {/* ── Sticky nav bar ── */}
      <header className="site-header">
        <nav className="nav-bar" aria-label="Main navigation">
          <Link to="/" className="logo-div" aria-label="TravelWorld home">
            <img src={logo} alt="TravelWorld" />
          </Link>

          <div className="nav-center">
            <ul>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={isActive(to) ? 'active' : ''} aria-current={isActive(to) ? 'page' : undefined}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="desktop-buttons">{authButtons}</div>

          <button
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <>
          <div className="drawer-backdrop" onClick={closeMenu} aria-hidden="true" />
          <nav className="mobile-drawer" aria-label="Mobile navigation">
            <button className="drawer-close" onClick={closeMenu} aria-label="Close menu">&#x2715;</button>
            <ul>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={isActive(to) ? 'active' : ''} onClick={closeMenu}>{label}</Link>
                </li>
              ))}
            </ul>
            <div className="drawer-buttons">{authButtons}</div>
          </nav>
        </>
      )}

      {/* ── Login / Sign up modal ── */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={isSignUp ? 'Create account' : 'Log in'}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)} aria-label="Close">&#x2715;</button>

            <div className="form-container">
              <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
              <p>{isSignUp ? 'Save your trips and book faster with TravelWorld.' : 'Log in to manage your trips with TravelWorld.'}</p>

              <form onSubmit={handleSubmit} noValidate>
                {isSignUp && (
                  <div className="auth-field">
                    <label htmlFor="auth-name">Full name</label>
                    <input
                      id="auth-name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      className={errors.name ? 'input-error' : ''}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <span className="auth-error">{errors.name}</span>}
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="auth-email">Email address</label>
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={errors.email ? 'input-error' : ''}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <span className="auth-error">{errors.email}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="auth-password">Password</label>
                  <input
                    id="auth-password"
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    className={errors.password ? 'input-error' : ''}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <span className="auth-error">{errors.password}</span>}
                </div>

                {formError && <p className="auth-banner" role="alert">{formError}</p>}

                <button type="submit" className="form-submit-btn" disabled={submitting}>
                  {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Log in'}
                </button>
              </form>

              <div className="form-footer">
                <p>
                  {isSignUp ? 'Already have an account?' : 'New to TravelWorld?'}
                  <button type="button" className="link-switch" onClick={switchMode}>
                    {isSignUp ? 'Log in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}