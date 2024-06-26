import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import Button from "../../components/button.component";
import AuthForm from "../../forms/auth.form";

export default function LoginPage() {
  return (
    <div>
      <div className="container mt-5">
        <AuthForm />
      </div>
    </div>
  );
}
