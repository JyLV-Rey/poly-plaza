import { useNavigate } from "react-router-dom";


function EditButton({productId}) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate(`/product/edit?productId=${productId}`)}
      >
        Edit
      </button>
    </div>
  );
}

export default EditButton