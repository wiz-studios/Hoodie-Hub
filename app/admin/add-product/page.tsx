import Layout from "../../../components/layout"
import AddProductForm from "../../../components/add-product-form"

export default function AddProductPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        <AddProductForm />
      </div>
    </Layout>
  )
}

