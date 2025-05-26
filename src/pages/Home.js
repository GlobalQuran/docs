import React from 'react';

const Home = () => {
  return (
    <>
      {/* Main hero unit */}
      <div className="jumbotron">
        <h1>Download Anything and Everything!</h1>
        <div className="pull-right">
          <iframe 
            id="twitter-widget-0" 
            scrolling="no" 
            frameBorder="0" 
            allowTransparency="true" 
            allowFullScreen="true" 
            className="twitter-follow-button twitter-follow-button-rendered" 
            title="Twitter Follow Button" 
            src="https://platform.twitter.com/widgets/follow_button.html?screen_name=GlobalQuran" 
            style={{ position: 'static', visibility: 'visible', width: '78px', height: '20px' }}
          />
          <div style={{ marginTop: '-30px', position: 'absolute' }} className="fb-like">
            <iframe 
              name="facebook-like" 
              width="100px" 
              height="20px" 
              title="Facebook Like Button" 
              frameBorder="0" 
              allowTransparency="true" 
              scrolling="no" 
              src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fpages%2FQuran-GlobalQurancom%2F192781430775518&width=100&layout=button_count&action=like&size=small&share=false&height=20&appId=291496434200831"
              style={{ border: 'none', visibility: 'visible', width: '100px', height: '20px' }}
            />
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="row">
        <div className="col-sm-4">
          <h2>Quran Data</h2>
          <p>All over text data is provided in easy format as text, json and js+json.</p>
          <ul className="list-unstyled">
            <li><a href="https://globalquran.com/download/data/">Quran</a></li>
            <li><a href="https://globalquran.com/download/data/">Translation</a></li>
            <li><a href="https://globalquran.com/download/data/">Tafsir</a></li>
          </ul>
        </div>
        <div className="col-sm-4">
          <h2>Resources</h2>
          <p>Useful Quran resources</p>
          <ul className="list-unstyled">
            <li>
              <a href="https://audio.globalquran.com/">Verse by Verse Audio Files</a> 
              <i className="icon-volume-up"></i>
            </li>
            <li>
              <a href="https://audio.globalquran.com/resources/quran-fonts.zip">Quran Fonts</a> 
              <i className="icon-font"></i>
            </li>
            <li>
              <a href="https://audio.globalquran.com/resources/quran-ayah-images.zip">6236 Ayah Images</a>
            </li>
          </ul>
        </div>
        <div className="col-sm-4">
          <h2>API & Documentation</h2>
          <p>Access Quran data programmatically</p>
          <ul className="list-unstyled">
            <li><a href="https://docs.globalquran.com/">API Documentation</a></li>
            <li><a href="https://github.com/GlobalQuran/site">Source Code</a></li>
            <li><a href="https://globalquran.com/contribute/">Contribute</a></li>
          </ul>
        </div>
      </div>

      <hr />

      <footer>
        <ul className="list-unstyled list-inline pull-right">
          <li><a href="https://github.com/GlobalQuran/site/issues">Feedback</a></li>
          <li><a href="https://github.com/GlobalQuran/site/issues">Report Bug</a></li>
          <li><a href="https://github.com/GlobalQuran/site/issues">Help</a></li>
          <li><a href="https://blog.globalquran.com/">Blog</a></li>
          <li><a href="https://blog.globalquran.com/about-us/">About us</a></li>
          <li><a href="https://blog.globalquran.com/contact-us/">Contact us</a></li>
        </ul>
        <p>© <a href="https://globalquran.com/">GlobalQuran.com</a> 2025</p>
      </footer>
    </>
  );
};

export default Home; 