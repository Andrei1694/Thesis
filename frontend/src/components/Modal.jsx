import { useState } from "react";
import Button from "./Button";

function DefaultModal({
  heading,
  children,
  buttonName,
  show,
  handleClose,
  handleShow,
}) {
  // Assuming you're managing the modal state outside of this component
  // and 'show' and 'handleClose' are provided as props

  return (
    <>
      {show && ( // Conditionally render the modal based on the 'show' prop
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-bold">
                {heading ?? "Modal heading"}
              </h5>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Close
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default DefaultModal;
