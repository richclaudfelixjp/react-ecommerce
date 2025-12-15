import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import CheckoutForm from '../components/Payment/CheckoutForm';
import api from '../api/api';
import { STRIPE_PUBLISHABLE_KEY } from '../config/stripe';
import CartContext from '../context/CartContext';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useContext(CartContext);
  
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');
  const isRetry = location.state?.isRetry || false;
  
  const [clientSecret, setClientSecret] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('注文IDが見つかりません。');
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        let response;
        
        if (isRetry) {
          response = await api.get(`/user/payment/retry-payment/${orderId}`);
        } else {
          response = await api.post('/user/payment/create-payment-intent', {
            orderId: parseInt(orderId)
          });
        }

        setClientSecret(response.data.clientSecret);
        
        const orderResponse = await api.get('/user/orders');
        const order = orderResponse.data.orders.find(o => o.id === parseInt(orderId));
        setOrderDetails(order);
        
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
          err.response?.data?.error || 
          '支払いの初期化に失敗しました。';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [orderId, isRetry]);

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    setPaymentSuccess(true);
    
    await fetchCart();
    
    setTimeout(() => {
      navigate('/orders', { 
        state: { 
          paymentSuccess: true,
          message: '支払いが正常に完了しました！' 
        } 
      });
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setError(error.message || '支払いに失敗しました。もう一度お試しください。');
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </Spinner>
        <p className="mt-3">支払い情報を読み込んでいます...</p>
      </Container>
    );
  }

  if (error && !clientSecret) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading style={{ textAlign: 'center' }}>エラーが発生しました</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/orders" className="btn btn-outline-danger">
              注文履歴に戻る
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (paymentSuccess) {
    return (
      <Container className="mt-5">
        <Alert variant="success">
          <Alert.Heading>
            <i className="fas fa-check-circle me-2" style={{ textAlign: 'center' }}></i>
            支払い完了
          </Alert.Heading>
          <p style={{ textAlign: 'center' }}>ご注文ありがとうございます！支払いが正常に処理されました。</p>
          <p className="mb-0" style={{ textAlign: 'center' }}>注文履歴ページに移動しています...</p>
        </Alert>
      </Container>
    );
  }

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Container className="mt-5">
      <Link className="btn btn-secondary mb-3" to="/orders">
        注文履歴に戻る
      </Link>
      
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h4" className="text-center">
              {isRetry ? '支払いを再試行' : '支払い情報'}
            </Card.Header>
            <Card.Body>
              {orderDetails && (
                <div className="mb-4">
                  <h5 style={{ textAlign: 'center' }}>注文概要</h5>
                  <hr />
                  <Row>
                    <Col xs={6}>注文番号:</Col>
                    <Col xs={6} className="text-end">#{orderDetails.id}</Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={6}><strong>合計金額:</strong></Col>
                    <Col xs={6} className="text-end">
                      <strong>¥{orderDetails.totalAmount.toLocaleString()}</strong>
                    </Col>
                  </Row>
                  <hr />
                </div>
              )}

              {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    amount={orderDetails?.totalAmount || 0}
                  />
                </Elements>
              )}
            </Card.Body>
          </Card>

          <div className="mt-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
            <p className="mb-1">
              <i className="fas fa-shield-alt me-1"></i>
              Stripeによる安全な決済処理
            </p>
            <p className="mb-0">
              カード情報は暗号化され、当社のサーバーには保存されません。
            </p>
          </div>
          <Alert variant="info" className="mt-3">
          <Alert.Heading style={{ fontSize: '0.95rem' }}>
            <i className="fas fa-credit-card me-2"></i>テスト用カード情報
          </Alert.Heading>
            <small>
              <strong>カード番号:</strong> 4242 4242 4242 4242<br />
              <strong>有効期限:</strong> 任意の将来の日付 (例: 12/34)<br />
              <strong>CVC:</strong> 任意の3桁 (例: 123)<br />
            </small>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;