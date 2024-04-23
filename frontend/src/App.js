import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

const Forms = ({ cloneData, onSave }) => {
  const [formData, setFormData] = useState(cloneData);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="card adjust-form2">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus={true}
          placeholder="Add Todo"
          className="form-control"
          type="text"
          name="task"
          value={formData.task}
          onChange={handleChange}
        />
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={handleChange}
        />
        Status (complete/incomplete)
        <br />
        <button className="btn btn-sm btn-success" type="submit">
          save
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [updation, setUpdation] = useState(false);
  const [cloneID, setCloneID] = useState(0);
  const [cloneData, setCloneData] = useState({ task: "", completed: false });
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const handleRemove = (item) => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}/`)
      .then((res) => refreshList());
  };

  const handleEdits = (itemData) => {
    setUpdation(!updation);
    setCloneID(itemData.id);
    setCloneData(itemData);
  };

  const handleSubmit = (item) => {
    if (item.id === cloneID) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then((res) => refreshList());
    } else {
      axios
        .post("http://localhost:8000/api/todos/", item)
        .then((res) => refreshList());
    }
  };

  return (
    <div className="card-body text-white bg-dark container adjust-card">
      <h2>My Todo List</h2>
      <br />
      {updation && <Forms cloneData={cloneData} onSave={handleSubmit} />}
      {todoList.map((item) => (
        <div key={item.id}>
          <span className={"crossed-line" + (item.completed ? "" : "active")}>
            {item.task}
          </span>
          <span onClick={() => handleRemove(item)} className="shift">
            <i className="shift fas fa-trash"></i>
          </span>
          <span onClick={() => handleEdits(item)} className="shift2">
            <i className="fas fa-edit"></i>
          </span>
          <hr className="new1"></hr>
        </div>
      ))}
      <Forms cloneData={cloneData} onSave={handleSubmit} />
    </div>
  );
};

export default App;
