import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // 1. Import Link

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      {/* 2. Replace <a> with <Link> */}
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        {/* 3. Replace <a> with <Link> */}
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;