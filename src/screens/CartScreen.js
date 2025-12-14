import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
  Form,
  Alert,
} from 'react-bootstrap';
import CartContext from '../context/CartContext';

const CartScreen = () => {
  const { cart, updateCartItemQuantity, removeCartItem } =
    useContext(CartContext);

  const handleQuantityChange = (itemId, qty, maxStock) => {
    const quantity = Number(qty);
    if (quantity > 0 && quantity <= maxStock) {
      updateCartItemQuantity(itemId, quantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('この商品をカートから削除してもよろしいですか？')) {
      removeCartItem(itemId);
    }
  };

  const hasStockIssues = cart?.items.some(
    (item) =>
      item.product.unitsInStock === 0 ||
      item.quantity > item.product.unitsInStock
  );

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        戻る
      </Link>
      {hasStockIssues && (
        <Alert variant="warning" style={{ textAlign: 'center'}}>
          カート内の一部の商品に在庫の問題があります。続行する前に更新してください。
        </Alert>
      )}
      <Row>
        <Col md={8}>
          {cart && cart.items.length === 0 ? (
            <div className="alert alert-info" style={{ textAlign: 'center' }}>
              カートは空です <Link to="/">お買い物に戻る</Link>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cart &&
                cart.items.map((item) => {
                  const isOutOfStock = item.product.unitsInStock === 0;
                  const quantityExceedsStock =
                    item.quantity > item.product.unitsInStock;

                  return (
                    <ListGroup.Item
                      key={item.id}
                      style={{
                        opacity: isOutOfStock ? 0.5 : 1,
                        backgroundColor: isOutOfStock ? '#f8f9fa' : 'white',
                      }}
                    >
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.product.imageURL}
                            alt={item.product.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                          {isOutOfStock && (
                            <div className="text-danger mt-1">
                              <strong>在庫切れ - 削除してください</strong>
                            </div>
                          )}
                          {!isOutOfStock && quantityExceedsStock && (
                            <div className="text-warning mt-1">
                              <strong>
                                在庫不足 (在庫: {item.product.unitsInStock})
                              </strong>
                            </div>
                          )}
                        </Col>
                        <Col md={2}>¥{item.product.unitPrice}</Col>
                        <Col md={2}>
                          {item.product.unitsInStock <= 10 ? (
                            <Form.Control
                              as="select"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  e.target.value,
                                  item.product.unitsInStock
                                )
                              }
                              disabled={isOutOfStock}
                              style={{
                                borderColor:
                                  quantityExceedsStock && !isOutOfStock
                                    ? '#ffc107'
                                    : '',
                              }}
                            >
                              {[
                                ...Array(
                                  Math.max(item.product.unitsInStock, item.quantity)
                                ).keys(),
                              ].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          ) : (
                            <Form.Control
                              type="number"
                              min="1"
                              max={item.product.unitsInStock}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  e.target.value,
                                  item.product.unitsInStock
                                )
                              }
                              disabled={isOutOfStock}
                              style={{
                                borderColor:
                                  quantityExceedsStock && !isOutOfStock
                                    ? '#ffc107'
                                    : '',
                              }}
                            />
                          )}
                        </Col>
                        <Col md={2}>
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <i className="fas fa-trash"></i> 削除
                            </Button>
                          </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  合計 (
                  {cart
                    ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
                    : 0}
                  ) 点
                </h2>
                ¥
                {cart
                  ? cart.items
                      .reduce(
                        (acc, item) =>
                          acc + item.quantity * item.product.unitPrice,
                        0
                      )
                      .toFixed(2)
                  : '0.00'}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={
                    cart ? cart.items.length === 0 || hasStockIssues : true
                  }
                >
                  レジに進む
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;