// import React, { useState, useEffect } from 'react';
// import styles from '../styles/NativeVideoAd.module.css';

// const NativeVideoAd = () => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setVisible(true);
//     }, 10000); // Show the ad after 30 seconds

//     return () => clearTimeout(timer); // Clear the timer if the component unmounts
//   }, []);

//   const closeAd = () => {
//     setVisible(false);
//   };

//   if (!visible) return null;

//   return (
//     <div className={styles.adOverlay}>
//       <div className={styles.adContent}>
//         <div className={styles.adInnerContent}>
//           <video className={styles.videoAd} controls autoPlay>
//             <source src="path_to_your_video.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//           <p className={styles.adText}>Discover Amazing Movies & Latest TV Shows!</p>
//         </div>
//         <div className={styles.bookmarkPrompt}>
//           <button className={styles.yesButton} onClick={closeAd}>
//             Close
//           </button>
//           <a href="your_watch_now_url" className={styles.noButton}>
//             Watch Now
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NativeVideoAd;







import React, { useState, useEffect } from 'react';
import styles from '../styles/NativeVideoAd.module.css';

const NativeVideoAd = () => {
    const [ad, setAd] = useState(null);
    const [visible, setVisible] = useState(false);

    // Fetch ad data when the component mounts
    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch('http://localhost:3000/ads.json');
                const data = await res.json();
                const selectedAd = data.find(ad => ad.id === 'ADS01');
                setAd(selectedAd || null);
            } catch (error) {
                console.error('Error fetching ad data:', error);
                setAd(null);
            }
        };

        fetchAd();
    }, []);

    // Show the ad after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, 10000); // Show the ad after 10 seconds

        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, []);

    // Handle closing the ad
    const closeAd = () => {
        setVisible(false);
    };

    if (!visible || !ad) return null;

    return (
        <div className={styles.adOverlay}>
            <div className={styles.adContent}>
                <div className={styles.adInnerContent}>
                    <iframe 
                        className={styles.iframeAd}
                        // src={ad.videourl} 
                        src={`https://geo.dailymotion.com/player/xkdl0.html?video=${ad.videourl}&mute=true&Autoquality=1080p`}
                        frameBorder="0" 
                        allowFullScreen 
                        title="Advertisement"
                    ></iframe>
                    <p className={styles.adText}>{ad.text}</p>
                </div>
                <div className={styles.bookmarkPrompt}>
                    <button className={styles.yesButton} onClick={closeAd}>
                        Close
                    </button>
                    <a href={ad.videourl} className={styles.noButton} target="_blank" rel="noopener noreferrer">
                        Watch Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NativeVideoAd;























// import React, { useState, useEffect } from 'react';
// import styles from '../styles/NativeVideoAd.module.css';

// const NativeVideoAd = () => {
//   const [ad, setAd] = useState(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const fetchAd = async () => {
//       try {
//         const res = await fetch('http://localhost:3000/ads.json');
//         const data = await res.json();
//         const selectedAd = data.find(ad => ad.id === 'ADS01');
//         setAd(selectedAd || null);
//       } catch (error) {
//         console.error('Error fetching ad data:', error);
//         setAd(null);
//       }
//     };

//     fetchAd();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setVisible(true);
//     }, 10000); // Show the ad after 10 seconds

//     return () => clearTimeout(timer); // Clear the timer if the component unmounts
//   }, []);

//   const closeAd = () => {
//     setVisible(false);
//   };

//   if (!visible || !ad) return null; // Do not display if ad is not available

//   return (
//     <div className={styles.adOverlay}>
//       <div className={styles.adContent}>
//         <div className={styles.adInnerContent}>
//           <iframe 
//             className={styles.iframeAd}
//             src={ad.videourl} 
//             frameBorder="0" 
//             allowFullScreen 
//             title="Advertisement"
//             width="100%" 
//             height="100%"
//           ></iframe>
//           <p className={styles.adText}>{ad.text}</p>
//         </div>
//         <div className={styles.bookmarkPrompt}>
//           <button className={styles.yesButton} onClick={closeAd}>
//             Close
//           </button>
//           <a href={ad.videourl} className={styles.noButton} target="_blank" rel="noopener noreferrer">
//             Watch Now
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NativeVideoAd;
