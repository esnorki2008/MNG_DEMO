import React from "react";

const Dashboard: React.FC = () => {
  // Proyectos de ejemplo para mostrar en la tabla
  const projects = [
    { id: 1, name: "Proyecto Alpha", status: "En progreso" },
    { id: 2, name: "Proyecto Beta", status: "Completado" },
    { id: 3, name: "Proyecto Gamma", status: "Pendiente" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Saludo al usuario */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Hola, Juan Monge
      </h1>

      {/* Tabla de proyectos */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Mis Proyectos
        </h2>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
