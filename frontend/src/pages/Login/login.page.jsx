import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import Button from "../../components/button.component";
import AuthForm from "../../forms/auth.form";
const tilte = import.meta.env.CEVA
export default function LoginPage() {
  console.log(import.meta.env.NODE_ENV)
  console.log(tilte)
  return (
    <div>
      <div className="container mt-5">
        {tilte}
        <AuthForm />
      </div>
    </div>
  );
}
