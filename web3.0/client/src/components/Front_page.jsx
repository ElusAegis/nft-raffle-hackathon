const Front_page = () => {
    return(
        <section id="hero">
            <div className="container">
                <div className="info">
                    <h1>Shinew.xyz is the new way to DROP your NFT’S.</h1>
                    <h2>Shinew is a platform that connects upcoming artists with the NFT world. We enable them to sell and promote their art work through NFT raffles and access to a large community!</h2>
                    <div className="artist-vs-participant">
                        <div className="artist">
                            <p>ARTIST?</p>
                            <a className="btn-artist" href="#">DROP</a>
                        </div>
                        <div className="participant">
                            <p>NFT LOVER?</p>
                            <a className="btn-participant" href="#">PARTICIPATE</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Front_page;