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
} from 'react-bootstrap';
import CartContext from '../context/CartContext';

const CartScreen = () => {
  const { cart, updateCartItemQuantity, removeCartItem } =
    useContext(CartContext);

  const handleQuantityChange = (itemId, qty) => {
    updateCartItemQuantity(itemId, qty);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('この商品をカートから削除してもよろしいですか？')) {
      removeCartItem(itemId);
    }
  };

  return (
    <>
        <Link className="btn btn-light my-3" to="/">
            戻る
        </Link>
        <Row>
        <Col md={8}>
            {cart && cart.items.length === 0 ? (
            <div className="alert alert-info" style={{ textAlign: 'center' }}>
                カートは空です <Link to="/">お買い物に戻る</Link>
            </div>
            ) : (
            <ListGroup variant="flush">
                {cart &&
                cart.items.map((item) => (
                    <ListGroup.Item key={item.id}>
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
                        </Col>
                        <Col md={2}>¥{item.product.unitPrice}</Col>
                        <Col md={2}>
                        <Form.Control
                            as="select"
                            value={item.quantity}
                            onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                            }
                        >
                            {[...Array(item.product.unitsInStock).keys()].map(
                            (x) => (
                                <option key={x + 1} value={x + 1}>
                                {x + 1}
                                </option>
                            )
                            )}
                        </Form.Control>
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
                ))}
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
                    disabled={cart ? cart.items.length === 0 : true}
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