import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import api from '../api/api';
import CartContext from '../context/CartContext';
import UserContext from '../context/UserContext';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

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

  const addToCartHandler = () => {
    if (userInfo) {
      addToCart(product.id, qty);
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleQuantityChange = (value) => {
    const quantity = Number(value);
    if (quantity >= 1 && quantity <= product.unitsInStock) {
      setQty(quantity);
    }
  };

  if (loading) {
    return <h3 style={{ textAlign: 'center' }}>読み込み中...</h3>;
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        戻る
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.imageURL} alt={product.name} fluid />
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
                  <Col>{product.unitsInStock > 0 ? '在庫あり' : '在庫なし'}</Col>
                </Row>
              </ListGroup.Item>

              {product.unitsInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>数量</Col>
                    <Col>
                      {product.unitsInStock <= 10 ? (
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.unitsInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      ) : (
                        <Form.Control
                          type="number"
                          min="1"
                          max={product.unitsInStock}
                          value={qty}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                        />
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="btn-block"
                  type="button"
                  disabled={product.unitsInStock === 0}
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