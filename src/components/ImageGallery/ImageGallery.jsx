import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

import './ImageGallery.css';

export default function ImageGallery({ elements, handleLargeImage }) {
  return (
    <ul className="ImageGallery">
      {elements.map(({ webformatURL, largeImageURL, tags }, i) => (
        <ImageGalleryItem
          key={i}
          webformatURL={webformatURL}
          largeImageURL={largeImageURL}
          tags={tags}
          onClick={handleLargeImage}
        />
      ))}
    </ul>
  );
}
