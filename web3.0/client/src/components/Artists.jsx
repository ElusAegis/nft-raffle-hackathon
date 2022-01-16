import profile1 from "../../../../img/profile1.png";
import video1 from "../../../../img/video1.png";

import profile2 from "../../../../img/profile2.png";
import video2 from "../../../../img/video2.png";

import profile3 from "../../../../img/profile3.png";
import video3 from "../../../../img/video3.png";

import profile4 from "../../../../img/profile4.png";
import video4 from "../../../../img/video4.png";


const Services = () => {
    return(
        <main>
            <h1 className="Rubik">ARTISTS</h1>

            <div className="main-container">
                <div className="profile-container">
                    <img src={profile1} alt="artist-profile-picture"/>
                    <p className="artist-description">For now : NFTs are like physical collector's items, only digital. So instead of getting an actual oil painting to hang on the wall, the buyer gets a digital file instead. They also get exclusive ownership rights. NFTs can have only one owner at a time.</p>
                </div>
                <div class="video-container">
                    <img src={video1} alt="artist-video"/>
                </div>
            </div>

            <div className="main-container">
                <div className="profile-container">
                    <img src={profile2} alt="artist-profile-picture"/>
                    <p className="artist-description">For now : NFTs are like physical collector's items, only digital. So instead of getting an actual oil painting to hang on the wall, the buyer gets a digital file instead. They also get exclusive ownership rights. NFTs can have only one owner at a time.</p>
                </div>
                <div class="video-container">
                    <img src={video2} alt="artist-video"/>
                </div>
            </div>

            <div className="main-container">
                <div className="profile-container">
                    <img src={profile3} alt="artist-profile-picture"/>
                    <p className="artist-description">For now : NFTs are like physical collector's items, only digital. So instead of getting an actual oil painting to hang on the wall, the buyer gets a digital file instead. They also get exclusive ownership rights. NFTs can have only one owner at a time.</p>
                </div>
                <div class="video-container">
                    <img src={video3} alt="artist-video"/>
                </div>
            </div>

            <div className="main-container">
                <div className="profile-container">
                    <img src={profile4} alt="artist-profile-picture"/>
                    <p className="artist-description">For now : NFTs are like physical collector's items, only digital. So instead of getting an actual oil painting to hang on the wall, the buyer gets a digital file instead. They also get exclusive ownership rights. NFTs can have only one owner at a time.</p>
                </div>
                <div class="video-container">
                    <img src={video4} alt="artist-video"/>
                </div>
            </div>
        </main>
        
    );
}

export default Services;