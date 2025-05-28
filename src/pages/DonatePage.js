import React from 'react';
import Footer from '../components/Footer';

const DonatePage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="jumbotron donation-hero islamic-pattern">
        <div className="container">
          <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold' }}>
            <i className="fas fa-heart" style={{ color: '#b99c45', marginRight: '15px' }}></i>
            Help Spread the Quran Globally
          </h1>
          <p style={{ fontSize: '1.4em', marginBottom: '30px', opacity: '0.9' }}>
            Join millions in making the Quran accessible to everyone, everywhere, for free
          </p>
          <div className="donation-meter" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <script src="https://donorbox.org/widget.js" paypalExpress="false"></script>
            <iframe
              height="93px"
              width="100%"
              src="https://donorbox.org/embed/sadaqah-jariyah-help-spread-the-quran-globally?donation_meter_color=%23b99c45&only_donation_meter=true&preview=true"
              style={{
                maxWidth: '500px',
                minWidth: '250px',
                minHeight: '90px',
                maxHeight: 'none !important',
                border: 'none',
                borderRadius: '10px'
              }}
              seamless="seamless"
              name="donorbox"
              frameBorder="0"
              scrolling="no"
              title="Donation Goal Meter"
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        {/* Impact Statistics */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2c5530' }}>
              Our Global Impact Since 2006
            </h2>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="impact-card">
              <i className="fas fa-users" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px' }}>Millions+</h3>
              <p style={{ color: '#666', margin: '0' }}>Users Served Annually</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="impact-card">
              <i className="fas fa-globe" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px' }}>100+</h3>
              <p style={{ color: '#666', margin: '0' }}>Languages Supported</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="impact-card">
              <i className="fas fa-code" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px' }}>First</h3>
              <p style={{ color: '#666', margin: '0' }}>Free Open Source Quran API</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="impact-card">
              <i className="fas fa-calendar" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px' }}>19 Years</h3>
              <p style={{ color: '#666', margin: '0' }}>Of Dedicated Service</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          <div className="col-md-8">
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#2c5530', marginBottom: '25px' }}>
                <i className="fas fa-mosque" style={{ marginRight: '10px', color: '#b99c45' }}></i>
                Your Sadaqah Jariyah Awaits
              </h2>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', marginBottom: '20px' }}>
                <strong>GlobalQuran.com</strong> is a pioneering non-profit Islamic organization dedicated to making the Holy Quran accessible to every soul on Earth. Since 2006, we've been breaking barriers and building bridges, ensuring that Allah's divine guidance reaches hearts across continents, cultures, and languages.
              </p>

              <div className="highlight-box">
                <h4 style={{ color: '#2c5530', marginBottom: '15px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  We Made History
                </h4>
                <p style={{ margin: '0', fontSize: '1.05em' }}>
                  We are the <strong>very first organization</strong> to make the complete Quran application
                  <strong> FREE and Open Source</strong> for everyone. This revolutionary step has enabled
                  countless developers, organizations, and individuals to spread Allah's message without barriers.
                </p>
              </div>

              <h3 style={{ color: '#2c5530', marginBottom: '20px' }}>
                <i className="fas fa-handshake" style={{ marginRight: '10px', color: '#b99c45' }}></i>
                Trusted by Industry Leaders
              </h3>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', marginBottom: '20px' }}>
                Major Islamic platforms trust our API and codebase, including:
              </p>
              <div className="row" style={{ marginBottom: '25px' }}>
                <div className="col-sm-6">
                  <ul className="trusted-partners">
                    <li>
                      <i className="fas fa-check-circle"></i>
                      Muxlim.com
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i>
                      UnderstandQuran.com
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i>
                      Ummaland.com
                    </li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <ul className="trusted-partners">
                    <li>
                      <i className="fas fa-check-circle"></i>
                      Quran.com
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i>
                      TheDeenShow.com
                    </li>
                    <li>
                      <i className="fas fa-check-circle"></i>
                      Baba Ali Show
                    </li>
                  </ul>
                </div>
              </div>

              <h3 style={{ color: '#2c5530', marginBottom: '20px' }}>
                <i className="fas fa-rocket" style={{ marginRight: '10px', color: '#b99c45' }}></i>
                Your Donation Powers Our Mission
              </h3>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', marginBottom: '20px' }}>
                Every contribution helps us expand our reach and enhance our services. Your donation directly supports:
              </p>

              <div className="row">
                <div className="col-sm-6">
                  <ul className="feature-list">
                    <li>
                      <i className="fas fa-server"></i>
                      <strong>Server Infrastructure & CDN</strong>
                    </li>
                    <li>
                      <i className="fas fa-code"></i>
                      <strong>Development & Programming</strong>
                    </li>
                    <li>
                      <i className="fas fa-book"></i>
                      <strong>Documentation & Resources</strong>
                    </li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <ul className="feature-list">
                    <li>
                      <i className="fas fa-paint-brush"></i>
                      <strong>Design & User Experience</strong>
                    </li>
                    <li>
                      <i className="fas fa-headset"></i>
                      <strong>Community Support</strong>
                    </li>
                    <li>
                      <i className="fas fa-globe-americas"></i>
                      <strong>Global Outreach Programs</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="cta-section" style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '15px' }}>
                  <i className="fas fa-infinity" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  Invest in Your Akhirah
                </h4>
                <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.9' }}>
                  Your donation is not just an investment in our project—it's an investment in your eternal future.
                  Every person who reads, learns, or finds guidance through our platform becomes part of your
                  <strong> continuous reward (Sadaqah Jariyah)</strong> that will benefit you in this life and the hereafter.
                </p>
              </div>
            </div>
          </div>

          {/* Donation Form Sidebar */}
          <div className="col-md-4">
            <div className="donation-sidebar">
              <div className="donation-sidebar-header">
                <h3 style={{ margin: '0', fontSize: '1.5em' }}>
                  <i className="fas fa-donate" style={{ marginRight: '8px' }}></i>
                  Donate Now
                </h3>
                <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
                  Make a difference today
                </p>
              </div>

              <div style={{ padding: '0' }}>
                <script src="https://donorbox.org/widget.js" paypalExpress="true"></script>
                <iframe 
                    src="https://donorbox.org/embed/sadaqah-jariyah-help-spread-the-quran-globally?amount=37" 
                    name="donorbox" 
                    title="Donation Form"
                    allowpaymentrequest="allowpaymentrequest" 
                    seamless="seamless" 
                    frameborder="0"
                     scrolling="no" 
                     height="900px" 
                     width="100%" 
                     style={{ maxWidth: '500px', minWidth: '250px', maxHeight: 'none' }} 
                     allow="payment"></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Donor Wall Section */}
        <div className="row" style={{ marginTop: '60px' }}>
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5530' }}>
              <i className="fas fa-users" style={{ marginRight: '10px', color: '#b99c45' }}></i>
              Our Generous Supporters
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.1em', marginBottom: '40px', color: '#666' }}>
              Join these amazing individuals who are helping spread the Quran globally
            </p>
            <div className="donor-wall-section">
              <script src="https://donorbox.org/widget.js" paypalExpress="false"></script>
              <iframe
                height="93px"
                width="100%"
                src="https://donorbox.org/embed/sadaqah-jariyah-help-spread-the-quran-globally?donor_wall_color=%23b99c45&only_donor_wall=true&preview=true"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  minWidth: '310px',
                  minHeight: '345px',
                  border: 'none',
                  borderRadius: '10px'
                }}
                seamless="seamless"
                name="donorbox"
                frameBorder="0"
                scrolling="no"
                title="Donor Wall"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="row" style={{ marginTop: '50px', marginBottom: '40px' }}>
          <div className="col-md-12">
            <div className="cta-section">
              <h2 style={{ marginBottom: '20px' }}>
                <i className="fas fa-heart" style={{ color: '#b99c45', marginRight: '10px' }}></i>
                Together, We Can Reach Every Heart
              </h2>
              <p style={{ fontSize: '1.2em', marginBottom: '25px', opacity: '0.9' }}>
                As our project grows and develops, we will reach even more millions of people worldwide,
                helping them read, learn, and understand Allah's beautiful revelation.
              </p>
              <p style={{ fontSize: '1.1em', margin: '0', fontStyle: 'italic' }}>
                "May Allah accept your contribution as Sadaqah Jariyah and grant you the best in this life and the hereafter."
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DonatePage; 