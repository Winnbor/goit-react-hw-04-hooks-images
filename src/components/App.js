import { Component } from 'react';
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

class App extends Component {
  state = {
    query: '',
    queryResult: null,
    elements: [],
    page: 1,
    error: null,
    status: 'idle',
    loaderStatus: '',
    showModal: false,
    largeImage: '',
    alt: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ loaderStatus: 'pending' });

      fetchQuery(this.state.query, this.state.page)
        .then(queryResult => {
          if (queryResult.hits.length === 0) {
            toast.error('Ooh! Nothing was found for your query');
            this.setState({
              status: 'idle',
              loaderStatus: '',
            });
          } else {
            this.setState({
              queryResult,
              status: 'resolved',
              loaderStatus: '',
              elements: queryResult.hits,
            });
          }
        })
        .catch(error =>
          this.setState({ error, status: 'rejected', loaderStatus: '' }),
        );
    }

    if (prevState.page !== this.state.page && this.state.page !== 1) {
      fetchQuery(this.state.query, this.state.page)
        .then(queryResult => {
          this.setState(prevState => ({
            queryResult,
            status: 'resolved',
            loaderStatus: '',

            elements: [...prevState.elements, ...queryResult.hits],
          }));
        })
        .catch(error =>
          this.setState({ error, status: 'rejected', loaderStatus: '' }),
        )
        .finally(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        });
    }
  }

  handleLoadMore = () => {
    this.setState(prevState => ({
      loaderStatus: 'pending',
      page: prevState.page + 1,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  handleLargeImage = (src, alt) => {
    this.toggleModal();
    this.setState({ largeImage: src, alt });
  };

  handleFormSubmit = query => {
    this.setState({ query, page: 1 });
  };

  render() {
    const {
      queryResult,
      elements,
      error,
      status,
      loaderStatus,
      showModal,
      largeImage,
      alt,
    } = this.state;

    return (
      <>
        <Container>
          <Searchbar onFormSubmit={this.handleFormSubmit} />
          {showModal && (
            <Modal onCloseModal={this.toggleModal}>
              <button
                type="button"
                className="Modal-btn"
                onClick={this.toggleModal}
              >
                X
              </button>
              <img src={largeImage} alt={alt} className="Large-image" />
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
                handleLargeImage={this.handleLargeImage}
              />
              {queryResult.hits.length > 0 && (
                <Button onClick={this.handleLoadMore} />
              )}
            </>
          )}
        </Container>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }
}

export default App;
