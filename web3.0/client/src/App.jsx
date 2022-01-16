import { Navbar, Welcome, Footer, Services, Transactions, Front_page, Artists } from './components';

const App = () => {
  return (
    <div id="page-container">
      <div id="content-wrap">
        <div className="min-h-screen">
        <div className="gradien-bg-welcome">
          <Navbar />
        </div>
        <Front_page />
        <Artists />
        <Footer />
      </div>
      </div>
    </div>
    
  )
}

export default App
