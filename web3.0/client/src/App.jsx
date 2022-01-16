import { Navbar, Welcome, Footer, Front_page, Artists, About, Dashboard } from './components';
import React, { useState } from 'react';

const AppPage = {
    Landing: 1,
    Artists: 2,
    About: 3,
    Dashboard: 4
};

const App = () => {

    const [page, setPage] = useState(AppPage.Landing);

  return (
    <div id="page-container">
      <div id="content-wrap">
        <div className="min-h-screen">
        <div className="gradien-bg-welcome">
            <Navbar />
        </div>

        { (page === AppPage.Landing) && <Front_page onArtistPressed={() => setPage(AppPage.Artists)} onParticipatePressed={() => setPage(AppPage.Dashboard)}/> }
        { (page === AppPage.Artists) && <Artists /> }
        { (page === AppPage.About) && <About /> }
        { (page === AppPage.Dashboard) && <Dashboard /> }

        <Footer />
      </div>
      </div>
    </div>
    
  )
}

export default App
