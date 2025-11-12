import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/static-pages.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="static-page">
      <nav className="static-nav">
        <Link to="/" className="static-nav__logo">শেকড়</Link>
        <Link to="/" className="static-nav__back">← Back to Home</Link>
      </nav>

      <div className="static-content">
        <h1>Contact Us</h1>
        
        <section className="static-section">
          <p>
            We'd love to hear from you. Whether you have a story to share, a question about 
            our platform, or want to contribute to শেকড়, please reach out.
          </p>
        </section>

        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-method">
              <h3>Email</h3>
              <p><a href="mailto:hello@sekor-bkc.com">hello@sekor-bkc.com</a></p>
            </div>
            <div className="contact-method">
              <h3>Editorial</h3>
              <p><a href="mailto:editorial@sekor-bkc.com">editorial@sekor-bkc.com</a></p>
            </div>
            <div className="contact-method">
              <h3>For Contributors</h3>
              <p>Interested in writing for us? Send your pitch to <a href="mailto:contribute@sekor-bkc.com">contribute@sekor-bkc.com</a></p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="story">Story Submission</option>
                <option value="contribute">Become a Contributor</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              {submitted ? 'Message Sent! ✓' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;