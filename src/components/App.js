import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from './Container/Container';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import Loader from 'react-loader-spinner';
import Modal from './Modal/Modal';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './App.css';

import { fetchQuery } from '../services/api';

function App() {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [elements, setElements] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [loaderStatus, setLoaderStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState({ src: '', alt: '' });

  useEffect(() => {
    if (query === '') {
      return;
    }

    setLoaderStatus('pending');

    fetchQuery(query)
      .then(queryResult => {
        if (queryResult.hits.length === 0) {
          toast.error('Ooh! Nothing was found for your query');
          setStatus('idle');
          setLoaderStatus('');
        } else {
          setQueryResult(queryResult);
          setElements(queryResult.hits);
          setStatus('resolved');
          setLoaderStatus('');
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
        setLoaderStatus('');
      });
  }, [query]);

  useEffect(() => {
    if (page !== 1) {
      fetchQuery(query, page)
        .then(queryResult => {
          setQueryResult(queryResult);
          setElements(prevState => [...prevState, ...queryResult.hits]);
          setStatus('resolved');
          setLoaderStatus('');
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
          setLoaderStatus('');
        })
        .finally(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        });
    }
  }, [query, page]);

  const handleLoadMore = () => {
    setLoaderStatus('pending');
    setPage(prevState => prevState + 1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleLargeImage = (src, alt) => {
    toggleModal();
    setLargeImage({ src, alt });
  };

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
  };

  return (
    <>
      <Container>
        <Searchbar onFormSubmit={handleFormSubmit} />
        {showModal && (
          <Modal onCloseModal={toggleModal}>
            <button type="button" className="Modal-btn" onClick={toggleModal}>
              X
            </button>
            <img
              src={largeImage.src}
              alt={largeImage.alt}
              className="Large-image"
            />
          </Modal>
        )}

        {status === 'idle' && <p>Type in your query</p>}

        {loaderStatus === 'pending' && (
          <div className="Loader">
            <Loader type="ThreeDots" color="#fa5b2b" height={80} width={80} />
          </div>
        )}

        {status === 'rejected' && { error }}

        {status === 'resolved' && (
          <>
            <ImageGallery
              elements={elements}
              handleLargeImage={handleLargeImage}
            />
            {queryResult.hits.length > 0 && <Button onClick={handleLoadMore} />}
          </>
        )}
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
