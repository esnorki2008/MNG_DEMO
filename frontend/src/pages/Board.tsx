import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Importamos las utilidades para Drag and Drop.
import SmallCard from "../components/SmallCard"; // Componente de tarjeta pequeña.
import { useNavigate, useParams } from "react-router-dom"; // Hooks para navegación y parámetros de URL.
import {
  useProjectIssuesHook,
  useUpdateIssueToProjectHook,
} from "../hooks/projectHook"; // Hooks personalizados para obtener issues y actualizar su estado.
import Loading from "../components/Loading"; // Componente de carga.
import { toast } from "react-toastify"; // Biblioteca para mostrar notificaciones.
import MenuBar from "../components/MenuBar"; // Componente de barra de menú.
import { faTasks } from "@fortawesome/free-solid-svg-icons"; // Icono de tareas de FontAwesome.

const Board: React.FC = () => {
  const navigate = useNavigate(); // Hook para la navegación.
  const { id } = useParams(); // Obtenemos el ID del proyecto desde los parámetros de la URL.

  // Estado inicial de los datos del tablero.
  const [data, setData] = useState<any>({
    tasks: [], // Lista de tareas (issues).
    columns: {
      "column-1": {
        id: "column-1",
        title: "To Do",
        status: "open",
      },
      "column-2": {
        id: "column-2",
        title: "In Progress",
        status: "inprogress",
      },
      "column-3": {
        id: "column-3",
        title: "Bug",
        status: "bug",
      },
      "column-4": {
        id: "column-4",
        title: "Cancelled",
        status: "cancelled",
      },
      "column-5": {
        id: "column-5",
        title: "Done",
        status: "done",
      },
    },
    columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"], // Orden de las columnas.
  });

  // Hook para obtener los issues del proyecto.
  const { projectIssues, projectIssuesLoading, projectIssuesError } =
    useProjectIssuesHook(Number(id) || 0);

  // Hook para actualizar el estado de un issue.
  const { updateIssueStatusProject } = useUpdateIssueToProjectHook();

  // Items del menú de navegación.
  const items = [
    {
      handler: `/`,
      title: "Back to Home",
      icon: faTasks,
    },
  ];

  // Función para mapear colores según el estado del issue.
  const mapColors = (status: string) => {
    switch (status) {
      case "open":
        return "gray";
      case "inprogress":
        return "yellow";
      case "bug":
        return "purple";
      case "cancelled":
        return "red";
      case "done":
        return "green";
      default:
        return "gray";
    }
  };

  // Actualizamos las tareas cuando se obtienen los issues del proyecto.
  useEffect(() => {
    if (projectIssues) {
      setData((prevData: any) => ({
        ...prevData,
        tasks: projectIssues.issues,
      }));
    }
  }, [projectIssues]);

  // Si los issues están cargando, mostramos el componente de carga.
  if (projectIssuesLoading) {
    return <Loading></Loading>;
  }

  // Manejador para el final del drag and drop.
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // Si no hay destino, salimos de la función.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return; // Si el destino es el mismo que el origen, no hacemos nada.

    const start = data.columns[source.droppableId]; // Columna de origen.
    const finish = data.columns[destination.droppableId]; // Columna de destino.

    if (start === finish) {
      return; // Si el origen y el destino son la misma columna, no hacemos nada.
    }

    // Buscamos la tarjeta que se está moviendo.
    const cardObject = data.tasks.find(
      (card: any) => `k${card.issueId}` === draggableId
    );
    cardObject.status = finish.status; // Actualizamos el estado de la tarjeta.

    const newState = {
      ...data,
      columns: {
        ...data.columns,
      },
    };

    try {
      const payload = { ...cardObject, projectId: Number(id) ?? 0 }; // Creamos el payload con los datos actualizados.
      await updateIssueStatusProject(payload); // Actualizamos el estado del issue en el servidor.
      toast.success("Issue updated successfully!"); // Mostramos mensaje de éxito.
    } catch (error) {
      toast.error("Failed to update issue. Please try again."); // Mostramos mensaje de error.
    }

    setData(newState); // Actualizamos el estado del tablero.
  };

  return (
    <div>
      {/* Barra de menú */}
      <MenuBar title="Issue Details" items={items} />
      {/* Contexto de drag and drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 p-8 bg-gray-100 min-h-[50vh] overflow-x-auto select-none">
          {/* Mapeamos las columnas del tablero */}
          {data.columnOrder.map((columnId: string) => {
            const column = data.columns[columnId];

            // Filtramos las tareas según el estado de la columna.
            const tasks = data.tasks.filter(
              (task: any) => task.status === column.status
            );

            return (
              <div
                key={column.id}
                className="bg-white rounded-md shadow-md p-4 w-2/3"
              >
                <h2 className="text-xl font-bold text-center mb-4">
                  {column.title}
                </h2>
                {/* Droppable permite que la columna sea un área de drop */}
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[100px]"
                    >
                      {/* Mapeamos las tareas dentro de la columna */}
                      {tasks.map((task: any, index: any) => (
                        <Draggable
                          key={`k${task.issueId}`}
                          draggableId={`k${task.issueId}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {/* Componente SmallCard para mostrar la tarea */}
                              <SmallCard
                                title={task.title}
                                description={task.description}
                                color={mapColors(task.status)}
                                onClick={() =>
                                  navigate(`/issue/${task.issueId}`)
                                }
                              ></SmallCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}{" "}
                      {/* Espacio reservado durante el drag */}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
