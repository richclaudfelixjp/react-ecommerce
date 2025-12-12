import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import api from '../api/api';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const fallbackImage = '/images/placeholder.jpg';

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      setProduct(null);
    }
    setLoading(false);
  };

  fetchProduct();
}, [id]);

if (loading) {
  return <h3 style={{ textAlign: 'center' }}>読み込み中...</h3>;
}

if (!product) {
  return <h3 style={{ textAlign: 'center' }}>商品が見つかりません</h3>;
}

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        戻る
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.imageURL || fallbackImage} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>価格: ¥{product.unitPrice}</ListGroup.Item>
            <ListGroup.Item>説明: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>価格:</Col>
                  <Col>
                    <strong>¥{product.unitPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>在庫状況:</Col>
                  <Col>
                    {product.unitsInStock > 0 ? '在庫あり' : '在庫切れ'}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.unitsInStock === 0 || product.status === false}
                >
                  カートに追加
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;