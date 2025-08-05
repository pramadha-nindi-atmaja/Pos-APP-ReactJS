import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveOrder } from "../features/CartSlice.js";
import Swal from "sweetalert2";

const TotalCart = () => {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.data);
  
  let sum = 0;
  if (carts && carts.length > 0) {
    sum = carts.reduce((result, item) => {
      return result + parseInt(item.totalPrice || item.price * item.qty);
    }, 0);
  }

  const saveCartData = () => {
    if (!carts || carts.length === 0) {
      Swal.fire("Error!", "Your cart is empty", "error");
      return;
    }
    
    const orderData = {
      date: new Date(),
      total: sum,
      detail: carts,
    };
    
    dispatch(saveOrder(orderData));
    Swal.fire("Order Success!", "Your order has been placed", "success");
  };

  return (
    <div className="fixed-bottom">
      <Row>
        <Col md={{ span: 3, offset: 9 }} className="bg-body pt-2 shadow">
          <div className="px-3">
            <h4>
              Total Pembayaran:{" "}
              <strong className="float-end me-3">
                Rp {sum.toLocaleString("id-ID")}
              </strong>
            </h4>
            <Button
              variant="primary"
              className="w-100 me-3 mb-3 mt-2"
              size="lg"
              onClick={saveCartData}
              disabled={!carts || carts.length === 0}
            >
              <FaCartArrowDown /> Bayar
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TotalCart;