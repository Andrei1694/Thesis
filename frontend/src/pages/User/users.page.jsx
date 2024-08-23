import React, { useState, useEffect } from "react";
import UserCard from "./usercard.component";
import { useQuery } from "react-query";
import { getAllUsers } from "../../utils/requests";
import Spinner from "../../components/spinner.component";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-8">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1
            ? "bg-customPrimary text-white"
            : "bg-white text-customDark"
            }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  // const authData = queryClient.getQueryData('authToken')
  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery(["users"], () => getAllUsers(), {
    onSuccess: (data) => {
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / PAGE_SIZE));
    },
    onError: (error) => {
      console.error("Error fetching device:", error);
      // Display error message to the user
    },
  });
  useEffect(() => {
    // fetchUsers();
  }, [currentPage, sortField, sortOrder]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-customPrimary">Users</h1>
      <div className="mb-8">
        <label htmlFor="sortField" className="mr-4">
          Sort by:
        </label>
        <select
          id="sortField"
          className="px-4 py-2 rounded-md border border-customDark"
          value={sortField}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="jobTitle">Job Title</option>
        </select>
      </div>
      {isLoading ? <div className="h-100 w-100"> <Spinner /> </div> :
        users?.map((user, index) => <UserCard key={`${index}${index}`} user={user} onClick={() => navigate(`/users/${user._id}`)} />)}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default UsersPage;
