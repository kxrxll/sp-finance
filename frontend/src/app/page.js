"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  let [monthFormToggle, setMonthFormToggle] = useState(0);
  const onToggleMonthCreation = () => {
    monthFormToggle === 0
      ? (monthFormToggle = setMonthFormToggle(1))
      : (monthFormToggle = setMonthFormToggle(0));
  };
  const onCreationClick = () => {
    const formEl = document.forms.newBudgetForm;
    const formData = new FormData(formEl);
    setMonthFormToggle(0);
    axios.post("https://localhost:7029/api/TodoItems", {
      month: formData.get("month"),
      sum: parseInt(formData.get("budget")),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const onTransactionClick = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const formEl = document.forms.newTransactionForm;
    const formData = new FormData(formEl);
    const newBudget = budgetList.find((budget) => budget.id == id);
    newBudget.transactions = [];
    newBudget.transactions.push({
      sum: formData.get("transaction"),
      date: Date.now(),
    });
    axios.delete("https://localhost:7029/api/TodoItems/" + id);
    axios.post("https://localhost:7029/api/TodoItems/", newBudget);
    getTheListFromTheServer();
  };
  const onDeleteClick = (e) => {
    e.preventDefault();
    const id = e.target.id;
    axios.delete("https://localhost:7029/api/TodoItems/" + id);
  };
  let [budgetList, setBudgetList] = useState([
    {
      id: 1,
      month: "Январь",
      transactions: [
        {
          id: 2,
          sum: 3000,
          date: "12 Jun 2023",
        },
        {
          id: 3,
          sum: 8000,
          date: "12 Jun 2023",
        },
        {
          id: 4,
          sum: -4000,
          date: "12 Jun 2023",
        },
      ],
      sum: 20000,
    },
  ]);
  const getTheListFromTheServer = async () => {
    await axios
      .get("https://localhost:7029/api/TodoItems")
      .then((response) => setBudgetList(response.data));
  };
  useEffect(() => {
    getTheListFromTheServer();
  });
  return (
    <div className="align-items-center container">
      <div className="col-md-5 col-lg-4 mx-auto my-5">
        <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-primary">Ваш бюджет</span>
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            onClick={onToggleMonthCreation}
          >
            + месяц
          </button>
        </h4>
        {monthFormToggle === 1 ? (
          <form className="input-group mb-3" id="newBudgetForm">
            <input
              type="text"
              className="form-control"
              placeholder="Месяц"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              name="month"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Бюджет"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              name="budget"
            />
            <button
              className="input-group-text"
              id="basic-addon2"
              formAction={onCreationClick}
            >
              добавить
            </button>
          </form>
        ) : (
          false
        )}
      </div>
      <div className="container d-flex grid gap-5">
        {budgetList.map((budget) => {
          return (
            <div className="g-col-6" id={budget.id}>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <span className="py-2">{budget.month} на начало</span>
                  <strong className="text-body-secondary py-2">
                    ${budget.sum}
                  </strong>
                </li>
                {budget.transactions
                  ? budget.transactions.map((transaction) => {
                      return transaction.sum > 0 ? (
                        <li
                          className="list-group-item d-flex justify-content-between lh-sm text-success"
                          id={transaction.id}
                        >
                          <div>
                            <h6 className="my-0">Приход</h6>
                            <small>
                              {new Date(transaction.date).toString()}
                            </small>
                          </div>
                          <span className="py-2">${transaction.sum}</span>
                        </li>
                      ) : (
                        <li
                          className="list-group-item d-flex justify-content-between lh-sm text-danger"
                          id={transaction.id}
                        >
                          <div>
                            <h6 className="my-0">Расход</h6>
                            <small>
                              {new Date(transaction.date).toString()}
                            </small>
                          </div>
                          <span className="py-2">${-transaction.sum}</span>
                        </li>
                      );
                    })
                  : false}
                <li className="list-group-item d-flex justify-content-between">
                  <span className="py-2">Остаток</span>
                  <strong className="py-2">
                    $
                    {budget.transactions
                      ? budget.transactions.reduce(
                          (accumulator, currentValue) => {
                            return accumulator + currentValue.sum;
                          },
                          budget.sum
                        )
                      : budget.sum}
                  </strong>
                </li>
              </ul>
              <form className="input-group mb-3" id="newTransactionForm">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  name="transaction"
                />
                <button
                  className="input-group-text"
                  id={budget.id}
                  onClick={onTransactionClick}
                >
                  добавить
                </button>
              </form>
              <button
                type="button"
                className="btn btn-danger w-100"
                id={budget.id}
                onClick={onDeleteClick}
              >
                удалить месяц
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
