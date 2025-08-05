import React, { useEffect, useState } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCart, setDetail } from "../features/CartSlice.js";
import TotalCart from "./TotalCart.jsx";
import CartModal from "./CartModal.jsx";

const Order = () => {
  const carts = useSelector((state) => state.cart.data);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleItemClick = (item) => {
    dispatch(setDetail(item));
    setModalShow(true);
  };

  return (
    <>
      <h2>Order List</h2>
      
      {error ? <div className="error-message">{error}</div> : null}
      
      <ListGroup>
        {carts ? (
          carts.map((item) => (
            <ListGroup.Item 
              key={item.id} 
              onClick={() => handleItemClick(item)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{item.name}</h5>
                <p>
                  Rp {parseInt(item.price).toLocaleString("id-ID")} x {item.qty}
                </p>
                {item.note && <small className="text-muted">{item.note}</small>}
              </div>
              <div className="fw-bold">
                Rp {parseInt(item.price * item.qty).toLocaleString("id-ID")}
              </div>
            </ListGroup.Item>
          ))
        ) : loading ? (
          <ListGroup.Item>Loading...</ListGroup.Item>
        ) : (
          <ListGroup.Item>No data</ListGroup.Item>
        )}
      </ListGroup>
      
      <TotalCart />
      
      <CartModal 
        show={modalShow} 
        onHide={() => setModalShow(false)} 
      />
    </>
  );
};

export default Order;