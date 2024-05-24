import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "react-query";
import { getUser } from "../../utils/requests";

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

function ProfilePicture({ formik }) {
  return (
    <div className="w-full md:w-1/3 mb-6 md:mb-0">
      {formik.values.profileImage ? (
        <img
          src={formik.values.profileImage}
          alt="Profile"
          className="w-40 h-40 rounded-full mx-auto"
        />
      ) : (
        <div className="w-40 h-40 bg-customLight flex items-center justify-center rounded-full mx-auto">
          <span className="text-4xl font-bold text-white">
            {getInitials(formik.values.firstName, formik.values.lastName)}
          </span>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onEdit(value);
  };

  return (
    <div className="mb-4">
      <label className="block text-customDark font-bold mb-2">{label}</label>
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            className="w-full px-3 py-2 text-customDark border rounded-md"
            value={value}
            onChange={(e) => onEdit(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 bg-customPrimary text-white rounded-md px-4 py-2"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-customDark">{value}</span>
          <button
            type="button"
            className="ml-2 bg-customPrimary text-white rounded-md px-4 py-2"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery(["users"], () => getUser(), {
    onSuccess: (data) => {
      console.log(data.users);
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / PAGE_SIZE));
    },
    onError: (error) => {
      console.error("Error fetching device:", error);
      // Display error message to the user
    },
  });
  const formik = useFormik({
    initialValues: {
      firstName: "John",
      lastName: "Doe",
      jobTitle: "Software Engineer",
      email: "john.doe@example.com",
      phone: "+1 123-456-7890",
      location: "New York, USA",
      aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
      profileImage: "", // Add the profileImage field
    },
    onSubmit: (values) => {
      // Handle form submission, e.g., send data to server
      console.log(values);
    },
  });

  const handleFieldEdit = (field, value) => {
    formik.setFieldValue(field, value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-customPrimary">My Profile</h1>
      <div className="bg-white rounded-[10px] shadow p-6">
        <div className="flex flex-col md:flex-row">
          <ProfilePicture formik={formik} />
          <div className="w-full md:w-2/3 md:pl-8">
            <ProfileField
              label="First Name"
              value={formik.values.firstName}
              onEdit={(value) => handleFieldEdit("firstName", value)}
            />
            <ProfileField
              label="Last Name"
              value={formik.values.lastName}
              onEdit={(value) => handleFieldEdit("lastName", value)}
            />
            <ProfileField
              label="Job Title"
              value={formik.values.jobTitle}
              onEdit={(value) => handleFieldEdit("jobTitle", value)}
            />
            <ProfileField
              label="Email"
              value={formik.values.email}
              onEdit={(value) => handleFieldEdit("email", value)}
            />
            <ProfileField
              label="Phone"
              value={formik.values.phone}
              onEdit={(value) => handleFieldEdit("phone", value)}
            />
            <ProfileField
              label="Location"
              value={formik.values.location}
              onEdit={(value) => handleFieldEdit("location", value)}
            />
            <div className="mb-6">
              <label
                htmlFor="aboutMe"
                className="block text-customDark font-bold mb-2"
              >
                About Me
              </label>
              <textarea
                id="aboutMe"
                className="w-full px-3 py-2 text-customDark border rounded-md"
                {...formik.getFieldProps("aboutMe")}
              ></textarea>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-customPrimary">
                Skills
              </h3>
              <ul className="flex flex-wrap">
                {formik.values.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="bg-customLight text-white rounded-full px-4 py-2 mr-2 mb-2"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-customPrimary text-white rounded-md px-4 py-2"
            onClick={formik.handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
