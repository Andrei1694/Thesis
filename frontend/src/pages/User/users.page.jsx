import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './usercard.component';

const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '+1 123-456-7890',
      location: 'New York, USA',
      profileImage: 'https://example.com/profile1.jpg',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      jobTitle: 'UI/UX Designer',
      email: 'jane.smith@example.com',
      phone: '+1 987-654-3210',
      location: 'London, UK',
      profileImage: 'https://example.com/profile2.jpg',
    },
    // Add more mock user data here...
  ];
  

const PAGE_SIZE = 10;
function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === index + 1 ? 'bg-customPrimary text-white' : 'bg-white text-customDark'
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
    const [users, setUsers] = useState(mockUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortField, setSortField] = useState('firstName');
    const [sortOrder, setSortOrder] = useState('asc');
  
    useEffect(() => {
      fetchUsers();
    }, [currentPage, sortField, sortOrder]);
  
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          params: {
            page: currentPage,
            pageSize: PAGE_SIZE,
            sortField,
            sortOrder,
          },
        });
  
        setUsers(response.data.users);
        setTotalPages(Math.ceil(response.data.totalCount / PAGE_SIZE));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const handleSortChange = (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortOrder('asc');
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
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }
  
  export default UsersPage;