import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, ListGroup, Spinner } from "react-bootstrap";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { CiCoffeeCup } from "react-icons/ci";
import { TbBrandCakephp } from "react-icons/tb";
import {
  categorySelectors,
  getAllCategory,
} from "../features/CategorySlice.js";
import { getProduct, getProductByCategory } from "../features/ProductSlice.js";

const Category = () => {
  const dispatch = useDispatch();
  const categories = useSelector(categorySelectors.selectAll);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getAllCategory());
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const setActive = (elem) => {
    document.querySelectorAll(".active").forEach((item) => {
      item.classList.remove("active");
    });
    elem.classList.add("active");
  };

  const getIcon = (categoryId) => {
    switch (categoryId) {
      case 1:
        return <FaUtensils />;
      case 2:
        return <CiCoffeeCup />;
      default:
        return <TbBrandCakephp />;
    }
  };

  const handleShowAll = (elem) => {
    setActive(elem);
    dispatch(getProduct());
  };

  const handleCategoryClick = (id, elem) => {
    setActive(elem);
    dispatch(getProductByCategory(id));
  };

  return (
    <Col md={2}>
      <h4>Product Category</h4>
      {loading && (
        <div className="d-flex align-items-center gap-2 mb-2">
          <Spinner animation="border" size="sm" />
          <span>Loading categories...</span>
        </div>
      )}
      <hr />

      <ListGroup>
        <ListGroup.Item
          id="cat-all"
          className="mb-1 shadow-sm"
          active
          action
          onClick={(e) => handleShowAll(e.currentTarget)}
        >
          <IoFastFoodSharp /> All Products
        </ListGroup.Item>

        {categories.map((item) => (
          <ListGroup.Item
            key={item.id}
            id={`cat-${item.id}`}
            className="mb-1 shadow-sm"
            action
            onClick={(e) => handleCategoryClick(item.id, e.currentTarget)}
          >
            {getIcon(item.id)} {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  );
};

export default Category;
