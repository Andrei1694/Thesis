import { useFormik } from "formik";
import Button from "../components/Button";
import Input from "../components/Input";
import * as yup from "yup";
const validationSchema = yup.object().shape({
  deviceName: yup.string().required("Device Name is required").min(3).max(25),
  description: yup.string(),
  location: yup.string(),
  country: yup.string(),
  ipAddress: yup.string(),
  serialNumber: yup.string(),
  manufacturer: yup.string(),
});
function splitAndCapitalizeCamelCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split at camel case
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words with a space
}
const initialValues = {
  deviceName: "",
  description: "",
  location: "",
  country: "",
  ipAddress: "",
  serialNumber: "",
  manufacturer: "",
};

function RegisterDeviceForm({ mode = "create", device, action }) {
  const { _id, ...editValues } = device ?? {};

  const formik = useFormik({
    initialValues: device ? editValues : initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (mode === "create") {
        action(values);
      }
      if (mode === "edit") {
        const changedFields = Object.keys(values).filter(
          (field) => values[field] !== formik.initialValues[field]
        );
        if (changedFields.length > 0) {
          const updatedData = {};
          changedFields.forEach((field) => {
            updatedData[field] = values[field];
          });
          console.log(typeof action);
          action(_id, updatedData);
        }
      }
      // resetForm();
    },
  });
  const renderFormFields = () => {
    const values = Object.entries(formik.values).map(([key, value]) => key);
    return values.map((val, index) => (
      <div key={`formRegister${index}`}>
        {/* <label htmlFor={val}>{splitAndCapitalizeCamelCase(val)}</label> */}
        <Input
          error={formik.errors[val]}
          label={splitAndCapitalizeCamelCase(val)}
          type="text"
          id={val}
          {...formik.getFieldProps(val)}
        />
      </div>
    ));
  };
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {renderFormFields()}
        <Button className="mt-5" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
export default RegisterDeviceForm;
