import React from "react";

export default function ResendVerificationEmail() {

  return (
    <>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        E-poçta tassyklama täzeden ibermek
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Tassyklama e-poçta salgyňyza iberildi. Poçtaňyzy barlaň we dowam etmek üçin e-poçtaňyzy tassyklaň.
      </p>
      <button
        onClick={handleResend}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        E-poçta tassyklama täzeden iber
      </button>
    </>
  );
}
