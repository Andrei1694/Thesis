import React, { useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser, updateUser } from "../../utils/requests";
import { useAuth } from "../../utils/auth";
import Input from "../../components/input.component";
import Button from "../../components/button.component";
import { useParams } from "react-router-dom";

const getInitials = (firstName, lastName) => {
  if (firstName && lastName) {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
  return "";
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
  const { isAuthenticated, userId: myId, isAdmin } = useAuth();
  const { id } = useParams();
  let userId = id ?? myId;
  const canEdit = userId === myId || isAdmin;

  const {
    data: userData,
    isLoading,
    refetch: fetchUser,
    error: fetchError,
  } = useQuery(["user", userId], () => getUser(userId), {
    onSuccess: (response) => {
      const { firstName, lastName, email } = response;
      formik.setValues({ firstName, lastName, email });
    },
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
    enabled: isAuthenticated && !!userId,
  });

  const { mutate: updateUserMutation, isLoading: isUpdating } = useMutation(
    (values) => updateUser(userId, values),
    {
      onSuccess: () => {
        fetchUser();
        setEditMode(false);
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        // Display error message to the user
      },
    }
  );

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
      } else {
        setEditMode(true);
      }
    },
  });

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  if (!userData) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-customPrimary">
        {canEdit ? "My Profile" : `${userData.firstName}'s Profile`}
      </h1>
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
          {canEdit && (<Button
            type="submit"
            className="bg-customPrimary text-white rounded-md px-4 py-2"
            onClick={formik.handleSubmit}
            disabled={isUpdating || !canEdit}
          >
            {isEditMode ? (isUpdating ? "Saving..." : "Save Changes") : "Edit"}
          </Button>)}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;