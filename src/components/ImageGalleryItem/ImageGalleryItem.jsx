import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal } from 'components/Modal';
import { GalleryItem, GalleryImg } from './ImageGalleryItem.styled';

export function ImageGalleryItem({ id, webformatURL, largeImageURL, tags }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  return (
    <>
      <GalleryItem key={id} onClick={toggleModal}>
        <GalleryImg src={webformatURL} alt={tags} width="400" />
      </GalleryItem>

      {showModal && (
        <Modal
          largeImageURL={largeImageURL}
          tags={tags}
          onClose={toggleModal}
        />
      )}
    </>
  );
}

ImageGalleryItem.propTypes = {
  id: PropTypes.number,
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
