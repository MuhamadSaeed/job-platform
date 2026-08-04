"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPayment } from "@/services/auth.service";

export default function PaymentForm({ slotId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await confirmPayment(slotId);

      router.push("/payment/success");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-8">

      <h1 className="text-3xl font-bold mb-8">
        Payment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <Input
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
        />

        <Input
          label="Card Holder"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={handleChange}
          placeholder="John Doe"
        />

        <div className="grid grid-cols-2 gap-4">

          <Input
            label="Expiry"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="12/28"
          />

          <Input
            label="CVV"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
          />

        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : "Confirm Payment"}
        </button>

      </form>

    </div>
  );
}

function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        {...props}
        className="w-full border rounded-xl px-4 py-3"
      />

    </div>
  );
}