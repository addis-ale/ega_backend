import CreateProductForm from "./CreateProductForm";

const CreatePage = () => {
  return (
    <div className="mt-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Create Produt</h1>
      <CreateProductForm />
    </div>
  );
};

export default CreatePage;
