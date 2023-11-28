import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

function DefaultPagination({ total, page }) {
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    setTotalPages(Math.ceil(total / 20));
  }, [page, total]);
  const createLink = (pageNumber) => {
    search.set('page', pageNumber)
    return `?${search.toString()}`
  }
  const renderPages = () => {
    let items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Link
          key={`page${number}`}
          to={createLink(number)}
          className={`inline-block px-3 py-1 mx-1 rounded-md ${parseInt(page) === number
              ? "bg-customPrimary text-white"
              : "bg-customSecondary text-customDark hover:bg-customSecondary"
            }`}
        >
          {number}
        </Link>
      );
    }
    return items;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex">{renderPages()}</div>
    </div>
  );
}

export default DefaultPagination;
