import React, { useState } from "react";
import { useAssignIssueToProjectHook } from "../hooks/projectHook"; // Importamos el hook personalizado para asignar issues a proyectos.
import Loading from "../components/Loading"; // Componente de carga.
import { toast } from "react-toastify"; // Biblioteca para mostrar notificaciones.
import { useNavigate, useParams } from "react-router-dom"; // Hooks para navegación y parámetros de ruta.

const AssignIssueToProject: React.FC = () => {
  const { id } = useParams(); // Obtenemos el ID del proyecto desde los parámetros de la ruta.
  const projectId = Number(id); // Convertimos el ID a número.
  const navigate = useNavigate(); // Hook para la navegación.

  // Definimos el estado inicial del formulario con datos vacíos.
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    status: "",
    type: "",
    dueDate: "",
    detail: {
      attachments: [], // Array vacío para adjuntos.
      testcase: [], // Array vacío para casos de prueba.
      testscenary: [], // Array vacío para escenarios de prueba.
      datatest: [], // Array vacío para datos de prueba.
      acceptance: [], // Array vacío para criterios de aceptación.
    },
  });

  // Tipos de issues disponibles.
  const issueTypes = [
    "bug",
    "spike",
    "test case",
    "user history",
    "review",
    "chore",
  ];

  // Manejador para cambios en los inputs del formulario.
  const handleInputChange = (e: any) => {
    const { name, value } = e.target; // Obtenemos el nombre y el valor del input.
    setFormData({ ...formData, [name]: value }); // Actualizamos el estado del formulario.
  };

  // Manejador para cambios en los campos del detalle (arrays).
  const handleDetailChange = (e: any, field: any) => {
    const { value } = e.target; // Obtenemos el valor del input.
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        [field]: value.split(",").map((item: any) => item.trim()), // Convertimos la cadena en un array y eliminamos espacios.
      },
    });
  };

  // Hook personalizado para manejar la creación de proyectos y issues.
  const { issueCreateLoading, issueCreateError, createProject } =
    useAssignIssueToProjectHook();

  // Manejador para el envío del formulario.
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Evitamos el comportamiento predeterminado del formulario.
    try {
      await createProject(projectId, formData); // Llamamos al hook para crear el issue.
      toast.success("Issue created successfully!"); // Mostramos mensaje de éxito.
      navigate("/dashboard"); // Redirigimos al dashboard.
    } catch (error) {
      toast.error("Failed to create issue. Please try again."); // Mostramos mensaje de error.
    }
  };

  // Si hay un error al crear el issue, mostramos una notificación.
  if (issueCreateError) {
    toast.error("Failed to create issue. Please try again.");
  }

  // Si la creación está en proceso, mostramos el componente de carga.
  if (issueCreateLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <form
        onSubmit={handleSubmit} // Manejador del formulario.
        className="w-full max-w-lg bg-white p-8 space-y-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-indigo-600 text-center">
          Create New Issue
        </h1>
        <div className="space-y-4">
          {/* Campo para el título del issue */}
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Campo para la descripción del issue */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Campo para el estado del issue */}
          <div>
            <label className="block text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Campo para el tipo de issue */}
          <div>
            <label className="block text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Campo para la fecha de vencimiento */}
          <div>
            <label className="block text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Campos para detalles adicionales como Test Case, Test Scenary, Data Test y Acceptance */}
          <div>
            <label className="block text-gray-700">Test Case</label>
            <textarea
              value={formData.detail.testcase.join(", ")}
              onChange={(e) => handleDetailChange(e, "testcase")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Test Scenary</label>
            <textarea
              value={formData.detail.testscenary.join(", ")}
              onChange={(e) => handleDetailChange(e, "testscenary")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Data Test</label>
            <textarea
              value={formData.detail.datatest.join(", ")}
              onChange={(e) => handleDetailChange(e, "datatest")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Acceptance</label>
            <textarea
              value={formData.detail.acceptance.join(", ")}
              onChange={(e) => handleDetailChange(e, "acceptance")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {/* Botón para crear el issue */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Create Issue
        </button>
      </form>
    </div>
  );
};

export default AssignIssueToProject;
