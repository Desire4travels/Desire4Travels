import './Background.css';
import img1 from '../../assets/Back1.webp';
import img2 from '../../assets/Back2.webp';
import img3 from '../../assets/Back3.webp';

const Background = ({ heroCount }) => {
  const images = [img1, img2, img3];
  const currentImage = images[heroCount] || null;

  if (!currentImage) return null;

  return (
    <img
      src={currentImage}
      alt="Hero Background"
      className="background"
      width={1920}             
      height={1080}            
      loading="eager"         
      fetchpriority="high"     
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
};

export default Background;
