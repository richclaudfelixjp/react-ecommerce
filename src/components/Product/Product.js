import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const status = product.status === false;
  const placeholderImage = '/images/placeholder.jpg';

  return (
    <Card
      className="my-3 p-3 rounded"
      style={{
        opacity: status ? 0.5 : 1,
        pointerEvents: status ? 'none' : 'auto',
      }}
    >
      <Link to={`/product/${product.id}`}>
        <Card.Img src={product.imageURL || placeholderImage} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {status ? (
          <Card.Text as="h5">入手不可</Card.Text>
        ) : (
          <Card.Text as="h3">¥{product.unitPrice}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;