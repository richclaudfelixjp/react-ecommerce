import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import api from '../api/api';

const CartScreen = () => {
  const { cart, updateCartItemQuantity, removeCartItem, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setOrderError(null);
    setOrderSuccess(false);

    try {
      await fetchCart();

      const hasStockProblems = cart?.items.some(
        (item) =>
          item.product.unitsInStock === 0 ||
          item.quantity > item.product.unitsInStock
      );

      if (hasStockProblems) {
        setOrderError('カート内の商品に在庫の問題があります。続行する前に更新してください。');
        setIsPlacingOrder(false);
        return;
      }

      const { data, status } = await api.post('/user/orders/create');

      if (status === 201) {
        const newOrder = data.orders && data.orders.length > 0 ? data.orders[0] : null;
        
        if (newOrder && newOrder.id) {
          navigate('/payment', { 
            state: { 
              orderId: newOrder.id,
              isRetry: false 
            } 
          });
        } else {
          setOrderError('注文が作成されましたが、IDを取得できませんでした。');
          setIsPlacingOrder(false);
        }
      }
    } catch (error) {
      setIsPlacingOrder(false);
      
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.message || 
          error.response.data?.error || 
          'カートの処理中にエラーが発生しました。カートを確認して再試行してください。';
        setOrderError(errorMessage);
        
        await fetchCart();
      } else {
        const errorMessage = error.response?.data?.message || 
          error.response?.data?.error || 
          '注文の処理中にエラーが発生しました。もう一度お試しください。';
        setOrderError(errorMessage);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const hasStockIssues = cart?.items.some(
    (item) =>
      item.product.unitsInStock === 0 ||
      item.quantity > item.product.unitsInStock
  );

  return (
    <>
      <Link className="btn btn-secondary my-3" to="/">
        戻る
      </Link>
      {hasStockIssues && (
        <Alert variant="warning" style={{ textAlign: 'center'}}>
          カート内の一部の商品に在庫の問題があります。続行する前に更新してください。
        </Alert>
      )}
      {orderError && (
        <Alert variant="danger" style={{ textAlign: 'center'}} dismissible onClose={() => setOrderError(null)}>
          {orderError}
        </Alert>
      )}
      {orderSuccess && (
        <Alert variant="success" style={{ textAlign: 'center'}}>
          ご注文ありがとうございます！注文が正常に処理されました。注文履歴ページに移動しています。。。
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
                    cart ? cart.items.length === 0 || hasStockIssues || isPlacingOrder : true
                  }
                  onClick={handlePlaceOrder}
                >
                  {isPlacingOrder ? '処理中...' : 'レジに進む'}
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