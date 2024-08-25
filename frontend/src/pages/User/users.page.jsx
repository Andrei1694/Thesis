import React, { useState, useEffect } from "react";
import UserCard from "./usercard.component";
import { useQuery } from "react-query";
import { getAllUsers } from "../../utils/requests";
import Spinner from "../../components/spinner.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination.component";
import { useFormik } from "formik";

function UsersFilter({ onSortChange }) {
  const sortOptions = [
    { label: "A-Z", value: { key: "firstName", order: "asc" } },
    { label: "Z-A", value: { key: "firstName", order: "desc" } },
    { label: "Newest", value: { key: "createdAt", order: "desc" } },
    { label: "Oldest", value: { key: "createdAt", order: "asc" } },
  ];
  const formik = useFormik({
    initialValues: { sortOption: sortOptions[0].value },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-xs">
      <div className="flex flex-col mb-4">
        <label htmlFor="sortSelect" className="mb-1">
          Sort By:
        </label>
        <select
          id="sortSelect"
          name="sortOption"
          value={JSON.stringify(formik.values.sortOption.label)}
          onChange={(e) => onSortChange(JSON.stringify(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        >
          {sortOptions?.map(({ label, value }) => (
            <option key={label} value={JSON.stringify(value)}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

function UsersPage() {
  // const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    setSearchParams({ page: 1, sortBy: "firstName:asc" });
  }, []);

  const {
    data,
    isLoading,
    isSuccess,
    error: fetchError,
  } = useQuery(["users", page, sortBy], () => getAllUsers(page, itemsPerPage, sortBy), {
    onSuccess: (data) => {

    },
    onError: (error) => {
      console.error("Error fetching device:", error);
      // Display error message to the user
    },
  });


  const handleSortChange = (option) => {
    const { key, order } = JSON.parse(JSON.parse(option));

    setSearchParams({
      sortBy: `${decodeURIComponent(key)}:${decodeURIComponent(order)}`,
      page: searchParams.get("page"),
    });
  };

  const renderUsers = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
      );
    }

    if (data) {
      const { users } = data;
      return (
        <div className="grid grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isSuccess && users?.map((user) => (
            <div key={`userCard${user._id}`}>
              <UserCard
                user={user}
                onClick={() => navigate(`/users/${user._id}`)}
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-customPrimary">Users</h1>
      <UsersFilter onSortChange={handleSortChange} />
      {renderUsers()}

      <div className="mt-5 mb-5">
        {!isLoading && (
          <Pagination
            page={searchParams.get("page")}
            total={data?.total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

    </div>
  );
}

export default UsersPage;
