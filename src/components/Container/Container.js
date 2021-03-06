import PropTypes from 'prop-types';

import './Container.css';

function Container({ children }) {
  return <div className="Container">{children}</div>;
}

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;
