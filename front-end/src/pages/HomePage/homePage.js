import React, { useState, useEffect } from "react";
import "./homepage.module.css";
import axiosClient from "../../api/api";
function HomePage() {
  const [dSKeHoach, setDSKeHoach] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [showForm, setShowForm] = useState(false); // State variable for form toggle
  const [sortField, setSortField] = useState(""); // State variable for sorting field
  const [sortOrder, setSortOrder] = useState(""); // State variable for sorting order
  const [filterField, setFilterField] = useState(""); // State variable for filtering field
  const [filterValue, setFilterValue] = useState(""); // State variable for filtering value
  const getListProduct = async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get(`/projects/nv?token=${token}`);
    setDSKeHoach(response.data.projects);
  };
  useEffect(() => {
    getListProduct();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/projects?token=${token}`,
        newRow,
        {}
      );

      console.log(response.data); // Xử lý phản hồi theo ý muốn

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      getListProduct();

      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setNewRow({});
    } catch (error) {
      console.error(error); // Xử lý lỗi một cách phù hợp
    }
  };
  const handleChange = (e, field) => {
    setNewRow({ ...newRow, [field]: e.target.value });
  };
  const toggleForm = () => {
    setShowForm(!showForm); // Toggle the state variable
  };
  const handleSort = (field) => {
    if (sortField === field) {
      // If the same field is clicked again, toggle the sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new field is clicked, set the sort field and default sort order to ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const renderSortIcon = (field) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        return <span>&uarr;</span>; // Up arrow for ascending order
      } else {
        return <span>&darr;</span>; // Down arrow for descending order
      }
    }
    return null; // No icon if the field is not sorted
  };
  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };
  return (
    <div>
      <div>
        <label>
          Filter Field:
          <select value={filterField} onChange={handleFilterFieldChange}>
            <option value="">Select Field</option>
            <option value="title">Title</option>
            <option value="description">Description</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="status">Status</option>
            <option value="budget">Budget</option>
            <option value="owner.fullname">Owner</option>
          </select>
        </label>
        <label>
          Filter Value:
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterValueChange}
            placeholder="Enter Value"
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>
              Title {renderSortIcon("title")}
            </th>
            <th onClick={() => handleSort("description")}>
              Description {renderSortIcon("description")}
            </th>
            <th onClick={() => handleSort("startDate")}>
              Start Date {renderSortIcon("startDate")}
            </th>
            <th onClick={() => handleSort("endDate")}>
              End Date {renderSortIcon("endDate")}
            </th>
            <th onClick={() => handleSort("status")}>
              Status {renderSortIcon("status")}
            </th>
            <th onClick={() => handleSort("budget")}>
              Budget {renderSortIcon("budget")}
            </th>
            <th onClick={() => handleSort("owner.fullname")}>
              Owner {renderSortIcon("owner.fullname")}
            </th>
          </tr>
        </thead>
        <tbody>
          {dSKeHoach
            .filter((project) =>
              filterField ? project[filterField] === filterValue : true
            )
            .map((project) => (
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
      <button onClick={toggleForm}>
        {showForm ? "Hide Form" : "Show Form"}
      </button>
      {/* Form for adding a new row */}
      {showForm && (
        <form onSubmit={handleSubmit}>
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
            type="date"
            value={newRow.startDate || ""}
            onChange={(e) => handleChange(e, "startDate")}
            placeholder="Start Date"
          />
          <input
            type="date"
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
          <button type="submit">Add Row</button>
        </form>
      )}
    </div>
  );
}

export default HomePage;
