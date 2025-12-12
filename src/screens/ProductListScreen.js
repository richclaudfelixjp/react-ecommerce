import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import api from '../api/api';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
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

  const deleteHandler = async (id) => {
    if (window.confirm('本当にこの商品を削除しますか？')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError('商品削除中にエラーが発生しました。');
      }
    }
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>商品リスト</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/product/create">
            <Button className="my-3">
              <i className="fas fa-plus"></i> 商品作成
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
        <Table className="minimal-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>商品名</th>
                <th>価格</th>
                <th>在庫</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>¥{product.unitPrice}</td>
                    <td>{product.unitsInStock}</td>
                    <td>
                        <LinkContainer to={`/admin/product/${product.id}`}>
                            <Button variant="light">
                                <i className="fas fa-edit"></i> 編集
                            </Button>
                        </LinkContainer>
                        <Button variant="danger" onClick={() => deleteHandler(product.id)}>
                        <i className="fas fa-trash"></i> 削除
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    </Container>
  );
};

export default ProductListScreen;