import React from "react";
import { toast } from "react-toastify"; // Biblioteca para notificaciones.
import MenuBar from "../components/MenuBar"; // Componente de barra de menú.
import { useNavigate } from "react-router-dom"; // Hook para la navegación.
import Cookies from "js-cookie"; // Biblioteca para manejar cookies.
import { Doughnut } from "react-chartjs-2"; // Componente gráfico de dona.
import { useFetchUserHook, useFetchUserProjectsHook } from "../hooks/userHook"; // Hooks personalizados para obtener datos del usuario y proyectos.
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // Icono de "plus" de FontAwesome.
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Importamos elementos de Chart.js para los gráficos.

ChartJS.register(ArcElement, Tooltip, Legend); // Registramos los componentes necesarios de Chart.js.

const items = [{ handler: "/project/create", title: "Create", icon: faPlus }]; // Items del menú.

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Hook para la navegación.

  // Hooks para obtener la información del usuario y proyectos.
  const { user, userLoading, userError } = useFetchUserHook();
  const { userProjects, userProjectsLoading, userProjectsError } =
    useFetchUserProjectsHook();

  // Mostramos un mensaje de carga mientras los datos se están obteniendo.
  if (userLoading || userProjectsLoading) {
    return <div className="text-center">Loading user data...</div>;
  }

  // Manejamos el error al obtener los proyectos.
  if (userProjectsError) {
    toast.error("Error fetching projects.");
    return <div className="text-center">Loading user data...</div>;
  }

  // Manejamos el error al obtener los datos del usuario.
  if (userError) {
    toast.error("Credentials error."); // Mostramos un mensaje de error.
    Cookies.remove("authToken"); // Eliminamos el token de autenticación.
    navigate("/login"); // Redirigimos al login.
  }

  // Calcula el porcentaje de issues completados.
  const calculateCompletionPercentage = (issues: any[]) => {
    const totalIssues = issues.length; // Número total de issues.
    const doneIssues = issues.filter((issue) => issue.status === "done").length; // Número de issues completados.
    return (doneIssues / totalIssues) * 100; // Calculamos el porcentaje de completados.
  };

  // Genera los datos para el gráfico de dona.
  const getDoughnutData = (issues: any[]) => {
    const doneIssues = issues.filter((issue) => issue.status === "done").length; // Número de issues completados.
    const notDoneIssues = issues.length - doneIssues; // Número de issues no completados.

    return {
      labels: ["Done", "Not Done"], // Etiquetas para el gráfico.
      datasets: [
        {
          data: [doneIssues, notDoneIssues], // Datos de issues completados y no completados.
          backgroundColor: ["#4caf50", "#e0e0e0"], // Colores para el gráfico (verde para completados, gris para no completados).
          hoverBackgroundColor: ["#388e3c", "#bdbdbd"], // Colores de hover para el gráfico.
        },
      ],
    };
  };

  // Formateamos una fecha en formato DD/MM/YYYY.
  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Devolvemos la fecha formateada.
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h4>Hello, it's nice to see you here!</h4>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
        {`${user?.name} ${user?.familyName}`}{" "}
        {/* Mostramos el nombre completo del usuario */}
      </h1>
      <MenuBar title="My Projects" items={items} /> {/* Barra de menú */}
      <div className="bg-white shadow-lg rounded-lg p-4 pt-0 md:p-6 md:pt-0 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {userProjects?.projects.map((project: any, key) => (
            <div
              key={key}
              className="border p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/project/${project.projectId}`)} // Navegamos al proyecto seleccionado.
            >
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                {project.name} {/* Nombre del proyecto */}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>{" "}
              {/* Descripción del proyecto */}
              <div className="mb-4">
                <h4 className="text-md font-semibold">Due Date:</h4>
                <p>{formatDate(project.dueDate)}</p>{" "}
                {/* Fecha de entrega del proyecto */}
              </div>
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2">Issues Progress</h4>
                <Doughnut data={getDoughnutData(project.issues)} />{" "}
                {/* Gráfico de progreso de issues */}
                <p className="mt-2 text-sm">
                  Completed:{" "}
                  <strong>
                    {calculateCompletionPercentage(project.issues).toFixed(2)}%{" "}
                    {/* Porcentaje de issues completados */}
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
