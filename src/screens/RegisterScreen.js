import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import api from '../api/api';
import UserContext from '../context/UserContext';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post(
        '/auth/register',
        { username, password }
      );

      setMessage(data + '. 移動中。。。');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response && err.response.data ? err.response.data : 'エラー発生');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1 style={{ textAlign: 'center' }}>登録</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          {loading && <Spinner animation="border" />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="username">
              <Form.Label>ユーザー名</Form.Label>
              <Form.Control
                type="text"
                placeholder="ユーザー名を入力してください"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                type="password"
                placeholder="パスワードを入力してください"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
              登録
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              アカウントをお持ちですか？ <Link to="/login" className="text-primary fw-bold">ログイン</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;