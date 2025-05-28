import React from 'react';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="jumbotron" style={{ background: 'linear-gradient(135deg, #b99c45 0%, #9b833a 100%)', color: 'white', textAlign: 'center', padding: '60px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold' }}>
            <i className="fas fa-book-open" style={{ marginRight: '15px' }}></i>
            Our Journey Since 2006
          </h1>
          <p style={{ fontSize: '1.4em', marginBottom: '0', opacity: '0.9' }}>
            Pioneering the world's first free and open-source Quran platform
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        {/* Mission Statement */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-12">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ color: '#2c5530', marginBottom: '25px', fontSize: '2.5em' }}>
                <i className="fas fa-heart" style={{ color: '#b99c45', marginRight: '10px' }}></i>
                Our Sacred Mission
              </h2>
              <p style={{ fontSize: '1.3em', lineHeight: '1.7', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
                To make the Holy Quran easily accessible in every home, in every language, 
                through every device - breaking down barriers and building bridges to Allah's divine guidance.
              </p>
            </div>
          </div>
        </div>

        {/* The Story */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-8 col-md-offset-2">
            <div style={{ background: '#f8f9fa', padding: '40px', borderRadius: '10px', borderLeft: '5px solid #b99c45' }}>
              <h3 style={{ color: '#2c5530', marginBottom: '25px' }}>
                <i className="fas fa-seedling" style={{ color: '#b99c45', marginRight: '10px' }}></i>
                How It All Began
              </h3>
              <p style={{ fontSize: '1.1em', lineHeight: '1.8', marginBottom: '20px' }}>
                In 2006, a simple yet profound need sparked a revolution. Islamic websites struggled to provide 
                the Holy Quran to their visitors - there was no easy-to-use interface, no accessible API, 
                and certainly no free solution for those who couldn't code.
              </p>
              <p style={{ fontSize: '1.1em', lineHeight: '1.8', marginBottom: '20px' }}>
                <strong>Thanks to Allah (glory be unto Him)</strong>, what started as a solution to fill this gap 
                has grown into something far greater - a global platform that serves millions of hearts seeking 
                divine guidance, completely free and open to all.
              </p>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '25px' }}>
                <h4 style={{ color: '#b99c45', marginBottom: '15px' }}>
                  <i className="fas fa-trophy" style={{ marginRight: '8px' }}></i>
                  A Historic Achievement
                </h4>
                <p style={{ margin: '0', fontSize: '1.05em', fontStyle: 'italic' }}>
                  We became the <strong>first organization in the world</strong> to make a complete Quran application 
                  FREE and Open Source, enabling countless developers and organizations to spread Allah's message without barriers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2c5530' }}>
              <i className="fas fa-globe" style={{ color: '#b99c45', marginRight: '10px' }}></i>
              Our Global Impact
            </h2>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ padding: '30px 20px', background: '#f8f9fa', borderRadius: '10px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fas fa-users" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px', fontSize: '2em' }}>Millions+</h3>
              <p style={{ color: '#666', margin: '0' }}>Users Served Globally</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ padding: '30px 20px', background: '#f8f9fa', borderRadius: '10px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fas fa-language" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px', fontSize: '2em' }}>100+</h3>
              <p style={{ color: '#666', margin: '0' }}>Languages Supported</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ padding: '30px 20px', background: '#f8f9fa', borderRadius: '10px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fas fa-calendar" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px', fontSize: '2em' }}>19</h3>
              <p style={{ color: '#666', margin: '0' }}>Years of Service</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ padding: '30px 20px', background: '#f8f9fa', borderRadius: '10px', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fas fa-code" style={{ fontSize: '3em', color: '#b99c45', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2c5530', marginBottom: '10px', fontSize: '2em' }}>First</h3>
              <p style={{ color: '#666', margin: '0' }}>Free Open Source API</p>
            </div>
          </div>
        </div>

        {/* About the Quran */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-10 col-md-offset-1">
            <div style={{ background: 'linear-gradient(135deg, #2c5530 0%, #1e3a21 100%)', color: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '25px', fontSize: '2em' }}>
                <i className="fas fa-book" style={{ marginRight: '10px' }}></i>
                About the Holy Quran
              </h3>
              <p style={{ fontSize: '1.2em', lineHeight: '1.8', marginBottom: '20px', opacity: '0.95' }}>
                The Holy Quran is the central religious text of Islam - the book of Divine guidance and direction for mankind. 
                Muslims believe it to be the final revelation of Allah (God), with the original Arabic text preserved 
                in its purest form for over 1,400 years.
              </p>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', margin: '0', opacity: '0.9', fontStyle: 'italic' }}>
                All translations are interpretations of the original meanings, and we strive to present them 
                with the utmost respect and accuracy they deserve.
              </p>
            </div>
          </div>
        </div>

        {/* Our Amazing Team */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-12">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2c5530' }}>
              <i className="fas fa-hands-helping" style={{ color: '#b99c45', marginRight: '10px' }}></i>
              The Hearts Behind the Mission
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '40px', color: '#666' }}>
              Since 2006, countless dedicated souls have contributed their time, skills, and resources to make this vision a reality.
            </p>
          </div>
        </div>

        {/* Contributors Grid */}
        <div className="row" style={{ marginBottom: '40px' }}>
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid #b99c45' }}>
              <h4 style={{ color: '#2c5530', marginBottom: '15px' }}>
                <i className="fas fa-user-tie" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                Leadership & Vision
              </h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Abdul Basit</strong> - <a href="https://basit.me" target="_blank" rel="noopener noreferrer">Basit.me</a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Moazzam Khan</strong> - <a href="https://moazzam-khan.com" target="_blank" rel="noopener noreferrer">Moazzam-Khan.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid #b99c45' }}>
              <h4 style={{ color: '#2c5530', marginBottom: '15px' }}>
                <i className="fas fa-palette" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                Design & Development
              </h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Umme Ahmed</strong> - <a href="https://cre8tive-pixels.com" target="_blank" rel="noopener noreferrer">Cre8tive-Pixels.com</a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>İbrahim</strong> - <a href="https://listen2quran.com" target="_blank" rel="noopener noreferrer">listen2quran.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid #b99c45' }}>
              <h4 style={{ color: '#2c5530', marginBottom: '15px' }}>
                <i className="fas fa-database" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                Data & Research
              </h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>QD</strong> - Corpus Data Specialist
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Dr. Shehnaz</strong> - Word by Word Translation
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Hamid Zarrabi-Zadeh</strong> - <a href="https://tanzil.net" target="_blank" rel="noopener noreferrer">Tanzil.net</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', borderLeft: '4px solid #b99c45' }}>
              <h4 style={{ color: '#2c5530', marginBottom: '15px' }}>
                <i className="fas fa-handshake" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                Community Partners
              </h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Nour Sharabash</strong> - <a href="https://quran.com" target="_blank" rel="noopener noreferrer">Quran.com</a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>Bassem Shama</strong> - <a href="https://quran.com" target="_blank" rel="noopener noreferrer">Quran.com</a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <i className="fas fa-star" style={{ color: '#b99c45', marginRight: '8px' }}></i>
                  <strong>M Ali</strong> - <a href="https://deen-ul-islam.org" target="_blank" rel="noopener noreferrer">Deen-ul-Islam.org</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Thanks */}
        <div className="row" style={{ marginBottom: '50px' }}>
          <div className="col-md-10 col-md-offset-1">
            <div style={{ background: 'linear-gradient(135deg, #b99c45 0%, #9b833a 100%)', color: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '25px', fontSize: '2em' }}>
                <i className="fas fa-heart" style={{ marginRight: '10px' }}></i>
                Gratitude Beyond Words
              </h3>
              <p style={{ fontSize: '1.2em', lineHeight: '1.8', marginBottom: '20px', opacity: '0.95' }}>
                <strong>Firstly, we thank Allah (glory be unto Him)</strong> for blessing this project and allowing it to reach millions of hearts worldwide.
              </p>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', marginBottom: '20px', opacity: '0.9' }}>
                We extend our deepest gratitude to <strong>Ahmedre, Sajid Pandore (Ummah.com), Sheraz Sheikh</strong>, 
                and countless unnamed heroes who have contributed their time, skills, and duas to make this vision a reality.
              </p>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', margin: '0', opacity: '0.9', fontStyle: 'italic' }}>
                To all the organizations and individuals working tirelessly to provide Islamic resources - 
                you are the true champions of this ummah.
              </p>
            </div>
          </div>
        </div>

        {/* Join Our Mission */}
        <div className="row" style={{ marginBottom: '40px' }}>
          <div className="col-md-12">
            <div style={{ textAlign: 'center', background: '#f8f9fa', padding: '50px 30px', borderRadius: '15px' }}>
              <h2 style={{ color: '#2c5530', marginBottom: '25px', fontSize: '2.5em' }}>
                <i className="fas fa-users" style={{ color: '#b99c45', marginRight: '10px' }}></i>
                Be Part of Something Greater
              </h2>
              <p style={{ fontSize: '1.3em', lineHeight: '1.8', marginBottom: '30px', color: '#666', maxWidth: '800px', margin: '0 auto 30px auto' }}>
                Every day, millions of people around the world turn to our platform to connect with Allah's guidance. 
                Your skills, time, or support can help us reach even more hearts and make the Quran accessible to every corner of the globe.
              </p>
              <div className="row" style={{ marginTop: '40px' }}>
                <div className="col-md-4" style={{ marginBottom: '20px' }}>
                  <div style={{ padding: '20px' }}>
                    <i className="fas fa-code" style={{ fontSize: '2.5em', color: '#b99c45', marginBottom: '15px' }}></i>
                    <h4 style={{ color: '#2c5530', marginBottom: '10px' }}>Developers</h4>
                    <p style={{ color: '#666', margin: '0' }}>Help us build and improve our open-source platform</p>
                  </div>
                </div>
                <div className="col-md-4" style={{ marginBottom: '20px' }}>
                  <div style={{ padding: '20px' }}>
                    <i className="fas fa-language" style={{ fontSize: '2.5em', color: '#b99c45', marginBottom: '15px' }}></i>
                    <h4 style={{ color: '#2c5530', marginBottom: '10px' }}>Translators</h4>
                    <p style={{ color: '#666', margin: '0' }}>Help us make the Quran available in more languages</p>
                  </div>
                </div>
                <div className="col-md-4" style={{ marginBottom: '20px' }}>
                  <div style={{ padding: '20px' }}>
                    <i className="fas fa-donate" style={{ fontSize: '2.5em', color: '#b99c45', marginBottom: '15px' }}></i>
                    <h4 style={{ color: '#2c5530', marginBottom: '10px' }}>Supporters</h4>
                    <p style={{ color: '#666', margin: '0' }}>Your support helps us maintain and grow our services</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '30px' }}>
                <a href="/donate" className="btn btn-primary" style={{ marginRight: '15px', padding: '12px 30px', fontSize: '1.1em' }}>
                  <i className="fas fa-heart" style={{ marginRight: '8px' }}></i>
                  Support Our Mission
                </a>
                <a href="https://github.com/GlobalQuran/site" className="btn btn-outline-primary" style={{ padding: '12px 30px', fontSize: '1.1em' }}>
                  <i className="fab fa-github" style={{ marginRight: '8px' }}></i>
                  Contribute Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage; 