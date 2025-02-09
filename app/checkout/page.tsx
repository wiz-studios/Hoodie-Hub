import Layout from "../../components/layout"
import CheckoutForm from "../../components/checkout-form"

export default function CheckoutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <CheckoutForm />
        </div>
      </div>
    </Layout>
  )
}

