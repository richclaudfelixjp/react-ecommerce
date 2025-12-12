import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import api from '../api/api';
import Product from '../components/Product/Product';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products`);
        const sortedData = data.sort((a, b) => a.id - b.id);
        setProducts(sortedData);
      } catch (error) {
        setProducts(null);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h3 style={{ textAlign: 'center' }}>読み込み中...</h3>;
  }

  return (
    <>
      <Row>
        {products.map((product) => (
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;