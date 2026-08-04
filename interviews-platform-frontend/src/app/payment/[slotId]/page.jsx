import PaymentForm from "@/components/payment/PaymentForm";

export default async function PaymentPage({ params }) {
  const { slotId } = await params;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <PaymentForm slotId={slotId} />
    </main>
  );
}