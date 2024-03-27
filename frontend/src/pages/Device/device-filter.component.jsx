import { useFormik } from "formik";

const sortOptions = [
  { label: "A-Z", value: { key: "deviceName", order: "asc" } },
  { label: "Z-A", value: { key: "deviceName", order: "desc" } },
  { label: "Newest", value: { key: "createdAt", order: "asc" } },
  { label: "Oldest", value: { key: "createdAt", order: "desc" } },
];

function DeviceFilter({ onSortChange }) {
  const formik = useFormik({
    initialValues: { sortOption: sortOptions[0].value },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-xs">
      <div className="flex flex-col mb-4">
        <label htmlFor="sortSelect" className="mb-1">
          Sort By:
        </label>
        <select
          id="sortSelect"
          name="sortOption"
          value={JSON.stringify(formik.values.sortOption.label)}
          onChange={(e) => onSortChange(JSON.stringify(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
        >
          {sortOptions.map(({ label, value }) => (
            <option key={label} value={JSON.stringify(value)}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

export default DeviceFilter;
