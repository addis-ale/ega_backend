import UpdateProductForm from "../updateProduct";
interface UpdateProductPageProps {
  params: { productId: string };
}
const UpdateProductPage = ({ params }: UpdateProductPageProps) => {
  const { productId } = params;
  console.log(params);
  return (
    <div className="mt-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">
        Update Produt {productId}
      </h1>
      <UpdateProductForm productId={productId} />
    </div>
  );
};

export default UpdateProductPage;
