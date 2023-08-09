import React, { useState, useEffect } from "react";
import "./homepage.module.css";
import axios from "axios";

function HomePage() {
  const [dSKeHoach, setDSKeHoach] = useState([]);
  const [newRow, setNewRow] = useState({});

  useEffect(() => {
    const getListProduct = async () => {
      const token = localStorage.getItem("Token");
      const response = await axios.get(`http://localhost:8080/api/projects/`);
      setDSKeHoach(response.data.projects);
    };
    getListProduct();
  }, []);

  const addRow = async () => {
    try {
      // Call API to add the new row
      const response = await axios.post(
        "http://localhost:8080/api/projects/",
        newRow
      );
      const addedRow = response.data;

      // Update the state with the added row
      setDSKeHoach([...dSKeHoach, addedRow]);
      setNewRow({});
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const handleChange = (e, field) => {
    setNewRow({ ...newRow, [field]: e.target.value });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {dSKeHoach.map((project) => (
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.status}</td>
              <td>{project.budget}</td>
              <td>{project.owner.fullname}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form for adding a new row */}
      <form onSubmit={addRow}>
        <input
          type="text"
          value={newRow.title || ""}
          onChange={(e) => handleChange(e, "title")}
          placeholder="Title"
        />
        <input
          type="text"
          value={newRow.description || ""}
          onChange={(e) => handleChange(e, "description")}
          placeholder="Description"
        />
        <input
          type="text"
          value={newRow.startDate || ""}
          onChange={(e) => handleChange(e, "startDate")}
          placeholder="Start Date"
        />
        <input
          type="text"
          value={newRow.endDate || ""}
          onChange={(e) => handleChange(e, "endDate")}
          placeholder="End Date"
        />
        <input
          type="text"
          value={newRow.status || ""}
          onChange={(e) => handleChange(e, "status")}
          placeholder="Status"
        />
        <input
          type="text"
          value={newRow.budget || ""}
          onChange={(e) => handleChange(e, "budget")}
          placeholder="Budget"
        />
        <input
          type="text"
          value={newRow.owner || ""}
          onChange={(e) => handleChange(e, "owner")}
          placeholder="Owner"
        />
        <button type="submit">Add Row</button>
      </form>
    </div>
  );
}

export default HomePage;
