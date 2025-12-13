import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState(0.00);
  const [unitsInStock, setUnitsInStock] = useState(0);
  const [status, setStatus] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        setSku(data.sku);
        setName(data.name);
        setDescription(data.description || '');
        setUnitPrice(data.unitPrice);
        setStatus(data.status);
        setUnitsInStock(data.unitsInStock);
        setImageURL(data.imageURL || '');
        setLoading(false);
      } catch (err) {
        setError('商品情報の取得に失敗しました');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError(null);

    try {
      const { data } = await api.post(`/admin/products/${productId}/image`, formData);
      setImageURL(data.imageURL);
      setUploading(false);
    } catch (err) {
      console.error(err);
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      setError(`画像のアップロードに失敗しました: ${message}`);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const productData = {
      id: productId,
      sku,
      name,
      description,
      unitPrice,
      status,
      unitsInStock,
      imageURL,
    };

    try {
      const { data } = await api.put(`/admin/products/${productId}`, productData);
      setSuccess(`商品 "${data.name}" の更新に成功しました！`);

    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (err.response.status === 400) {
          const messages = Object.values(errorData).join(', ');
          setError(`作成失敗: ${messages}`);
        } else if (err.response.status === 409) {
          setError(errorData.error);
        } else {
          setError(errorData.message || 'エラー発生');
        }
      } else {
        setError('エラー発生');
      }
    }
  };

  return (
    <Container>
      <Link className="btn btn-light my-3" to="/admin/manageproducts">
        戻る
      </Link>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1 style={{ textAlign: 'center' }}>商品編集</h1>
          {loading && <p>読み込み中...</p>}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {!loading && (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="sku">
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="SKUを入力"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="name">
                <Form.Label>商品名</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="商品名を入力"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>説明</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="説明を入力"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

                <Form.Group controlId="unitPrice">
                <Form.Label>価格</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="価格を入力"
                    value={unitPrice}
                    min={0.00}
                    step={0.01}
                    onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) && Number(value) > 0) {
                        setUnitPrice(value);
                    } else if (value === null) {
                        setUnitPrice(0.00);
                    }
                    }}
                ></Form.Control>
                </Form.Group>

                <Form.Group controlId="unitsInStock">
                <Form.Label>在庫数</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="在庫数を入力"
                    value={unitsInStock}
                    min={0}
                    step={1}
                    onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d+$/.test(value) && Number(value) > 0) {
                        setUnitsInStock(value);
                    } else if (value === null) {
                        setUnitsInStock(0);
                    }
                    }}
                ></Form.Control>
                </Form.Group>

                <Form.Group controlId="imageURL">
                  <Form.Label>画像</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="画像URLを入力"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    readOnly
                  ></Form.Control>
                  <Form.Control
                    type="file"
                    onChange={uploadFileHandler}
                    accept="image/*"
                  ></Form.Control>
                  {uploading && <p>アップロード中...</p>}
                </Form.Group>

                <Form.Group controlId="status" className="mt-3">
                <Form.Check
                    type="checkbox"
                    label="有効ステータス"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                ></Form.Check>
                </Form.Group>

              <Button type="submit" variant="primary" className="mt-3">
                更新
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditScreen;