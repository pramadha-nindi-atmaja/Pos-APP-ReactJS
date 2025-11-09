import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { delCart, updCart } from "../features/CartSlice.js";

const CartModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const dataEdit = useSelector((state) => state.cart.dataEdit);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dataEdit) setData(dataEdit);
  }, [dataEdit, show]);

  const handleQtyChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setData((prev) => ({ ...prev, qty: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.qty || data.qty <= 0) {
      Swal.fire("Error!", "Quantity must be greater than 0", "error");
      return;
    }

    setIsLoading(true);
    dispatch(updCart(data));
    setIsLoading(false);
    onHide();
    Swal.fire({
      title: "Update Success!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        dispatch(delCart(id));
        setIsLoading(false);
        onHide();
        Swal.fire({
          title: "Deleted!",
          text: "Your item has been removed from cart.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  if (!data || Object.keys(data).length === 0) return null;

  const { id, name, code, image, price, qty, note } = data;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      aria-labelledby="cart-modal-title"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="cart-modal-title">
            {name} <span className="text-muted fs-6">({code})</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-4">
            <Col md={4} className="text-center">
              {image && (
                <img
                  src={`/img/${image}`}
                  alt={name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px" }}
                />
              )}
              <p className="mt-2 fw-bold">
                Rp. {price?.toLocaleString("id-ID")}
              </p>
            </Col>

            <Col md={8}>
              <Form.Group className="mb-3" controlId="formQty">
                <Form.Label>Jumlah</Form.Label>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      qty > 1 && setData((prev) => ({ ...prev, qty: qty - 1 }))
                    }
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Masukkan jumlah"
                    value={qty || ""}
                    onChange={handleQtyChange}
                    required
                    className="text-center"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setData((prev) => ({ ...prev, qty: (qty || 0) + 1 }))
                    }
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNote">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Tambahkan catatan khusus (opsional)"
                  value={note || ""}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <div className="fw-bold">Total:</div>
                <div className="fw-bold text-primary">
                  Rp. {((price || 0) * (qty || 0)).toLocaleString("id-ID")}
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="submit"
            variant="success"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
          <Button
            onClick={() => handleDelete(id)}
            variant="danger"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            onClick={onHide}
            variant="secondary"
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

CartModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default CartModal;
