import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addTransaction,
  CATEGORIES,
  selectTransactions,
} from "../features/transactions/transactionsSlice";
import {
  selectBudgets,
  calculateTotalExpenses,
} from "../features/budgets/budgetsSlice";
import { v4 as uuidv4 } from "uuid";

export default function TransactionForm() {
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);
  const transactions = useSelector(selectTransactions);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCategoryBudget = (category) => {
    const budget = budgets.find((budget) => budget.category === category);
    const remainingFunds = Number.parseFloat(
      budget.amount - calculateTotalExpenses(transactions, category)
    ).toFixed(2);
    return remainingFunds;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addTransaction({
        category: category,
        description: description || "no description...",
        amount: parseFloat(amount),
        id: uuidv4(),
      })
    );
    setCategory(CATEGORIES[0]);
    setDescription("");
    setAmount(0);
    handleClose();
  };

  return (
    <section className="new-transaction-section">
      <button onClick={handleShow}>Add Transaction</button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c + " | " + getCategoryBudget(c)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                type="text"
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
                type="number"
                step="0.01"
              />
            </Form.Group>
            <button type="submit">Submit</button>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
}
