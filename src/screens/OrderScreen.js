import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Table, Alert, Badge, Card, Button } from 'react-bootstrap';
import api from '../api/api';

const OrderScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {

    if (location.state?.paymentSuccess) {
      setSuccessMessage(location.state.message);

      window.history.replaceState({}, document.title);
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/user/orders');
        const sortedOrders = (data.orders || []).sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            '注文の読み込み中にエラーが発生しました。'
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location]);

  const handlePayNow = (orderId) => {
    navigate('/payment', {
      state: {
        orderId: orderId,
        isRetry: true
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { variant: 'warning', text: '保留中' },
      PAID: { variant: 'success', text: '支払い済み' },
      CANCELLED: { variant: 'danger', text: 'キャンセル' },
    };

    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) {
    return <h3 style={{ textAlign: 'center' }}>読み込み中...</h3>;
  }

  return (
    <>
      <Link className="btn btn-secondary my-3" to="/">
        戻る
      </Link>
      
      {successMessage && (
        <Alert variant="success" style={{ textAlign: 'center' }} dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" style={{ textAlign: 'center' }}>
          {error}
        </Alert>
      )}
      
      {orders.length === 0 ? (
        <Alert variant="info" style={{ textAlign: 'center' }}>
          注文履歴はありません。 <Link to="/" className="text-primary fw-bold">お買い物を始める</Link>
        </Alert>
      ) : (
        <div>
          {orders.map((order) => (
            <Card key={order.id} className="mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>注文番号:</strong> #{order.id}
                  </div>
                  <div>
                    <strong>注文日:</strong> {formatDate(order.orderDate)}
                  </div>
                  <div>
                    <strong>ステータス:</strong> {getStatusBadge(order.status)}
                  </div>
                  {order.status === 'PENDING' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handlePayNow(order.id)}
                    >
                      <i className="fas fa-credit-card me-1"></i>
                      今すぐ支払う
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>商品名</th>
                      <th>単価</th>
                      <th>数量</th>
                      <th>小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/product/${item.productId}`}>
                            {item.productName}
                          </Link>
                        </td>
                        <td>{formatPrice(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>合計金額:</strong>
                      </td>
                      <td>
                        <strong>{formatPrice(order.totalAmount)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
                {order.paymentIntentId && (
                  <div className="text-muted mt-2">
                    <small>支払いID: {order.paymentIntentId}</small>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default OrderScreen;