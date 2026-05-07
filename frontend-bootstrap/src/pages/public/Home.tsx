import React from 'react';
import { Container } from 'reactstrap';
import ProductListing from '../../components/ProductListing';

const Home: React.FC = () => {
  return (
    <div>
      <div className="bg-primary text-white py-5 mb-4">
        <Container>
          <h1>Welcome to Laptop Store</h1>
          <p className="lead">Find the best laptops at unbeatable prices.</p>
        </Container>
      </div>
      <ProductListing />
    </div>
  );
};

export default Home;
