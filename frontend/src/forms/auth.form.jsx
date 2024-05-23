import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { register } from "../utils/requests";
import { setAuthToken } from "../utils/auth";
import { queryClient } from "../App";

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

const initialValues = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useMutation((userData) => register(userData), {
    onSuccess: (response) => {
      const jwtToken = response.user.token; // Assuming the server sends the token in the response data
      queryClient.setQueryData("authToken", jwtToken);
      setAuthToken(jwtToken); // Store the token in local storage
      navigate("/devices");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const loginMutation = useMutation(
    (credentials) => axios.post("/api/login", credentials),
    {
      onSuccess: (response) => {
        const jwtToken = response.data.token; // Assuming the server sends the token in the response data
        queryClient.setQueryData("authToken", jwtToken, {
          staleTime: THIRTY_DAYS_IN_MS,
        });
        setAuthToken(jwtToken); // Store the token in local storage

        navigate("/");
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    }
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: isRegistering ? registerMutation.mutate : loginMutation.mutate,
  });

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    formik.resetForm();
  };

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
                className={`w-full px-3 py-2 border ${
                  formik.touched.firstName && formik.errors.firstName
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
                className={`w-full px-3 py-2 border ${
                  formik.touched.lastName && formik.errors.lastName
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
            className={`w-full px-3 py-2 border ${
              formik.touched.email && formik.errors.email
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
            className={`w-full px-3 py-2 border ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {isRegistering ? (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={toggleRegistration}
              className="text-blue-500 hover:underline"
            >
              Login
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={toggleRegistration}
              className="text-blue-500 hover:underline"
            >
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
