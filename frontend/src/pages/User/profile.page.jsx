import React, { useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser, updateUser } from "../../utils/requests";
import { queryClient } from "../../App";
import { getAuthToken } from "../../utils/auth";
import Input from "../../components/input.component";
import Button from "../../components/button.component";

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

function ProfilePage() {
  const [isEditMode, setEditMode] = useState(false);
  const authToken = queryClient.getQueryData("authToken") ?? getAuthToken();
  const id = authToken?.id;
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      // profileImage: "", // Add the profileImage field if needed
    },
    onSubmit: (values) => {
      if (isEditMode) {
        updateUserMutation(values);
        setEditMode(false);
      } else {
        setEditMode(true);
      }
    },
  });
  const {
    data,
    isLoading,
    refetch: fetchUser,
    error: fetchError,
  } = useQuery(["user", authToken.id], () => getUser(id), {
    onSuccess: (response) => {
      const { firstName, lastName, email } = response;
      formik.setValues({ firstName, lastName, email });
    },
    onError: (error) => {
      console.error("Error fetching user:", error);
      // Display error message to the user
    },

  });

  const { mutate: updateUserMutation, isLoading: isUpdating } = useMutation(
    (values) => updateUser(id, values),
    {
      onSuccess: () => {
        // Refetch user data after successful update
        fetchUser();
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        // Display error message to the user
      },
    }
  );



  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!id) {
    return <div>No user found.</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-customPrimary">My Profile</h1>
      <div className="bg-white rounded-[10px] shadow p-6">
        <div className="flex flex-col md:flex-row">
          <ProfilePicture formik={formik} />
          <div className="w-full md:w-2/3 md:pl-8">
            <Input
              id="firstName"
              type="text"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              disabled={!isEditMode}
            />
            <Input
              id="lastName"
              type="text"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              disabled={!isEditMode}
            />
            <Input
              id="email"
              type="text"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={!isEditMode}
            />
          </div>
        </div>
        <div className="mt-6">
          <Button
            type="submit"
            className="bg-customPrimary text-white rounded-md px-4 py-2"
            onClick={formik.handleSubmit}
          >
            {isEditMode ? "Save Changes" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
