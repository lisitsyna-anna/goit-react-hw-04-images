import { useState, useEffect } from 'react';

import { MagnifyingGlass } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { ButtonLoadMore } from 'components/ButtonLoadMore';

import { StyledApp, ErrorMessage } from './App.styled';
import * as API from '../../services/pixabayAPI';

export function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalImages, setTotalImages] = useState(0);

  const handleSubmit = searchQuery => {
    if (searchQuery.trim() === '') {
      toast.error('Enter a search term');
      return;
    }

    if (searchQuery === query) {
      toast.info('Same request. Enter a new word');
      return;
    }

    setImages([]);
    setPage(1);
    setQuery(searchQuery);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const mapHitsToImages = hits => {
    return hits.map(({ id, webformatURL, largeImageURL, tags }) => ({
      id,
      webformatURL,
      largeImageURL,
      tags,
    }));
  };

  useEffect(() => {
    if (!query) {
      return;
    }
    async function setNewStateFromRequest() {
      try {
        setIsLoading(true);
        const { hits, total: totalImages } = await API.getImages(query, page);

        const images = mapHitsToImages(hits);

        if (images.length === 0) {
          toast.error('There are no images matching your request.');
        }

        setImages(prevImages => [...prevImages, ...images]);
        setTotalImages(totalImages);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        console.log(error.message);
      }
    }

    setNewStateFromRequest();
  }, [query, page]);

  const showLoadMoreButton = images.length > 0 && totalImages - page * 12 > 0;

  return (
    <StyledApp>
      <Searchbar onSubmit={handleSubmit} />
      <ToastContainer position="top-right" autoClose={3000} />

      {error && (
        <ErrorMessage>
          Oops! Something went wrong. Try reloading the page
        </ErrorMessage>
      )}

      {images.length > 0 && <ImageGallery images={images} />}

      <MagnifyingGlass
        visible={isLoading && true}
        height="100"
        width="100"
        ariaLabel="MagnifyingGlass-loading"
        wrapperStyle={{
          margin: '0 auto',
        }}
        wrapperClass="MagnifyingGlass-wrapper"
        glassColor="#c0efff"
        color="#3f51b5"
      />

      {showLoadMoreButton && <ButtonLoadMore onLoadMore={handleLoadMore} />}
    </StyledApp>
  );
}
