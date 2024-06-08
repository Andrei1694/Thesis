import { useFormik } from "formik";
import * as yup from "yup";
import Button from "../components/button.component";
import Input from "../components/input.component";

const validationSchema = yup.object().shape({
  deviceName: yup.string().required("Device Name is required").min(3).max(25),
  description: yup.string(),
  location: yup.string(),
  country: yup.string(),
  ipAddress: yup.string(),
  serialNumber: yup.string(),
  manufacturer: yup.string(),
});

const initialValues = {
  deviceName: "",
  description: "",
  location: "",
  country: "",
  ipAddress: "",
  serialNumber: "",
  manufacturer: "",
};

function formatFieldName(fieldName) {
  return fieldName
    .split(/(?=[A-Z])/)
    .map((word) => word?.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DeviceForm({ mode = "create", device, onSubmit }) {
  const { _id, ...editValues } = device ?? {};

  const formik = useFormik({
    initialValues: device ? editValues : initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (mode === "create") {
        onSubmit(values);
      } else if (mode === "edit") {
        const updatedData = {};
        Object.keys(values).forEach((field) => {
          if (values[field] !== formik.initialValues[field]) {
            updatedData[field] = values[field];
          }
        });
        if (Object.keys(updatedData).length > 0) {
          onSubmit(_id, updatedData);
        }
      }
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-start">
      {Object.keys(formik.values).map((field) => (
        <Input
          key={field}
          label={formatFieldName(field)}
          error={formik.errors[field]}
          {...formik.getFieldProps(field)}
          className="w-full"
        />
      ))}
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
}

export default DeviceForm;
