import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 
        </h1>

        <p className="text-gray-600 mb-6">
          Your interview has been booked successfully.
        </p>

        <Link
          href="/notifications"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Go to Notifications
        </Link>
      </div>
    </main>
  );
}