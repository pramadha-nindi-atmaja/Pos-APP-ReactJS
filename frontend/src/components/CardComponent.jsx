import { Card, Col, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";

const CardComponent = ({ product, setCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = () => {
    setCart(product);
  };
  
  return (
    <Col md={4} xs={6} className="mb-4">
      <Card 
        className={`shadow-sm transition-all duration-200 ${isHovered ? 'shadow-md transform translate-y-[-5px]' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={"/img/" + product.image} 
            alt={product.name}
            className="product-image"
          />
          {product.stock <= 5 && (
            <Badge 
              bg="warning" 
              className="position-absolute top-0 end-0 m-2"
            >
              Stock: {product.stock}
            </Badge>
          )}
        </div>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            <span>{product.name}</span>
            <Badge bg="secondary" className="text-white">
              {product.code}
            </Badge>
          </Card.Title>
          <Card.Text className="fw-bold text-primary mb-2">
            Rp. {product.price.toLocaleString("id-ID")}
          </Card.Text>
          <button 
            className="btn btn-primary w-100" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardComponent.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    stock: PropTypes.number
  }),
  setCart: PropTypes.func.isRequired,
};

export default CardComponent;