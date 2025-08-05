import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { delCart, updCart } from "../features/CartSlice.js";
import Swal from "sweetalert2";

const CartModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const dataEdit = useSelector((state) => state.cart.dataEdit);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleQtyChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value >= 0) {
      setData({ ...data, qty: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData();
  };

  const updateData = () => {
    setIsLoading(true);
    
    // Validate data before dispatching
    if (!data.qty || data.qty <= 0) {
      Swal.fire("Error!", "Quantity must be greater than 0", "error");
      setIsLoading(false);
      return;
    }
    
    dispatch(updCart(data));
    setIsLoading(false);
    onHide();
    Swal.fire({
      title: "Update Success!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const deleteData = (id) => {
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
          showConfirmButton: false
        });
      }
    });
  };

  useEffect(() => {
    if (dataEdit) {
      setData(dataEdit);
    }
  }, [dataEdit, show]);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {data.name} <span className="text-muted fs-6">({data.code})</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Col md={4} className="text-center">
              {data.image && (
                <img
                  src={`/img/${data.image}`}
                  alt={data.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px" }}
                />
              )}
              <p className="mt-2 fw-bold">Rp. {data.price?.toLocaleString("id-ID")}</p>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="formQty">
                <Form.Label>Jumlah</Form.Label>
                <InputGroup>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => data.qty > 1 && setData({ ...data, qty: data.qty - 1 })}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Masukkan jumlah"
                    value={data.qty || ""}
                    onChange={handleQtyChange}
                    required
                    className="text-center"
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setData({ ...data, qty: (data.qty || 0) + 1 })}
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
                  value={data.note || ""}
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <div className="fw-bold">Total:</div>
                <div className="fw-bold text-primary">
                  Rp. {((data.price || 0) * (data.qty || 0)).toLocaleString("id-ID")}
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
            onClick={() => deleteData(data.id)}
            variant="danger"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={onHide} variant="secondary" disabled={isLoading}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

CartModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default CartModal;