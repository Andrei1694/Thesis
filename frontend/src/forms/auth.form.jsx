import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { login, register } from "../utils/requests";
import { setAuthToken, useAuth } from "../utils/auth";
import { queryClient } from "../App";
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .min(12, "Email must be at least 12 characters")
    .trim()
    .lowercase(),
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name must be at most 25 characters")
    .trim(),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name must be at most 25 characters")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be at most 25 characters"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .min(12, "Email must be at least 12 characters")
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be at most 25 characters"),
});

const initialValues = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  const handleAuthSuccess = (response) => {
    const { user, token } = response;
    queryClient.setQueryData("authToken", {
      token,
      isAuthenticated: true,
      user
    }, {
      staleTime: THIRTY_DAYS_IN_MS,
    });
    authLogin(token, user._id);
    navigate("/profile");
  };

  const handleAuthError = (error) => {
    console.error("Auth error:", error);
    setServerError(error.response?.data?.message || "An error occurred. Please try again.");
  };
  const registerMutation = useMutation(register, {
    onSuccess: handleAuthSuccess,
    onError: handleAuthError,
  });

  const loginMutation = useMutation(login, {
    onSuccess: handleAuthSuccess,
    onError: handleAuthError,
  });

  const formik = useFormik({
    initialValues,
    validationSchema: isRegistering ? validationSchema : loginSchema,
    onSubmit: (values) => {
      setServerError(null);
      if (isRegistering) {
        registerMutation.mutate(values);
      } else {
        loginMutation.mutate(values);
      }
    },
  });
  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setServerError(null);
    formik.resetForm();
  };

  const isLoading = registerMutation.isLoading || loginMutation.isLoading;

  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {isRegistering && (
          <>
            <div>
              <label htmlFor="firstName" className="block font-bold">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...formik.getFieldProps("firstName")}
                className={`w-full px-3 py-2 border ${formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="lastName" className="block font-bold">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...formik.getFieldProps("lastName")}
                className={`w-full px-3 py-2 border ${formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block font-bold">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full px-3 py-2 border ${formik.touched.email && formik.errors.email
              ? "border-red-500"
              : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="block font-bold">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className={`w-full px-3 py-2 border ${formik.touched.password && formik.errors.password
              ? "border-red-500"
              : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>

        {serverError && (
          <div className="text-red-500 text-sm">{serverError}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : (isRegistering ? "Register" : "Login")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleRegistration}
          className="text-blue-500 hover:underline"
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
