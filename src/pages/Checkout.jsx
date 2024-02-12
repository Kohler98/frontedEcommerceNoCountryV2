import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkout/CheckoutForm";
import StripeElements from "../components/checkout/StripeElements";
import CheckoutInfo from "../components/checkout/CheckoutInfo";
import { useForm } from "../hooks/useForm/useForm";

export const Checkout = ({ options }) => {
  const [stripe, setStripe] = useState(null);
  const { formState, onInputChange, setState } = useForm({
    nombre: "",
    apellido: "",
    email: "",
    pais: "",
    estado: "",
    ciudad: "",
    line1: "",
    phone: 123456789,
    postal_code: "",
    productos: "",
  });

  useEffect(() => {
    // Dynamically import the Stripe module
    import("@stripe/stripe-js")
      .then((stripeJs) =>
        stripeJs.loadStripe(
          "pk_test_51OLTCEH1kbewROnHlhKKtvH9pYc2jholZqwoMB7gr68ao8f7RVFnaMPlgvBR2g3wlzN4qyvBTk9hYIlJ1FZOTAoi00b2wvNDoO"
        )
      )
      .then((stripeInstance) => {
        setStripe(stripeInstance);
      })
      .catch((error) => {
        console.error("Error loading Stripe:", error);
      });
  }, []);

  if (!stripe) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <div className="pt-10">
      <Elements stripe={stripe} options={options}>
        <div className="flex flex-col justify-center items-center">
          {/* Components stacked on small screens */}
          <div className="lg:flex md:justify-center space-y-8 lg:space-y-0 lg:space-x-4">
            <CheckoutForm formulario={[formState, onInputChange]} />
            <StripeElements />
          </div>
          <div className="mt-8">
            <CheckoutInfo formulario={[formState, setState]} />
          </div>
        </div>
      </Elements>
    </div>
  );
};
