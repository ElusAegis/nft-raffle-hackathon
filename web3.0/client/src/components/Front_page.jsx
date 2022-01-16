const Front_page = ({onArtistPressed, onParticipatePressed}) => {
    return(
        <section id="hero">
            <div className="container">
                <div className="info">
                    <h1>Shinew.xyz is the new way to DROP your NFT’S.</h1>
                    <h2>Shinew is a platform that connects upcoming artists with the NFT world. We enable them to sell and promote their art work through NFT raffles and access to a large community!</h2>
                    <div className="artist-vs-participant">
                        <div className="artist">
                            <p>ARTIST?</p>
                            <a className="btn-artist" onClick={() => onArtistPressed()}>DROP</a>
                        </div>
                        <div className="participant">
                            <p>NFT LOVER?</p>
                            <a className="btn-participant" onClick={() => onParticipatePressed()}>PARTICIPATE</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Front_page;