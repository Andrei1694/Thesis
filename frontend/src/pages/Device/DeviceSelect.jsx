import { useFormik } from "formik";
const options = [
  {
    label: "[A-Z]",
    value: {
      name: "deviceName",
      order: "asc",
    },
  },
  {
    label: "[Z-A]",
    value: {
      name: "deviceName",
      order: "desc",
    },
  },
  {
    label: "Newest",
    value: {
      name: "createdAt",
      order: "asc",
    },
  },
  {
    label: "Oldest",
    value: {
      name: "createdAt",
      order: "desc",
    },
  },
];

function DeviceSelect({ action }) {
  const formik = useFormik({
    initialValues: {
      sort: {
        label: "sda",
        name: "deviceName",
        order: "asc",
      },
    },
  });

  const renderOptions = () => {
    return options.map(({ value, label }) => (
      <option key={label} value={JSON.stringify(value)}>
        {label}
      </option>
    ));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-xs">
      <div className="flex flex-col mb-4">
        <label htmlFor="filter" className="mb-1">
          Order By:
        </label>
        <select
          id="filter"
          name="sort"
          value={formik.values.sort.label}
          onChange={(e) => action(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        >
          {renderOptions()}
        </select>
      </div>
    </form>
  );
}

export default DeviceSelect;
