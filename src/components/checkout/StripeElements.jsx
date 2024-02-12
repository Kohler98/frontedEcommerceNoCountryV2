import React from "react";
import { useStripe, PaymentElement } from "@stripe/react-stripe-js";

export const StripeElements = () => {
  return (
    <div className="p-8 min-h-[300px] w-[500px]  bg-white shadow-md rounded-lg  max-w-[300px] md:max-w-[930px] ">
      {" "}
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Method</h2>
      <PaymentElement />
    </div>
  );
};

export default StripeElements;
