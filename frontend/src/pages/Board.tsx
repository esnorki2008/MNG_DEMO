import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SmallCard from "../components/SmallCard";
import { useParams } from "react-router-dom";
import {
  useProjectIssuesHook,
  useUpdateIssueToProjectHook,
} from "../hooks/projectHook";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const Board: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({
    tasks: [],
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
    columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
  });

  const { projectIssues, projectIssuesLoading, projectIssuesError } =
    useProjectIssuesHook(Number(id) || 0);

  const { updateIssueStatusProject } = useUpdateIssueToProjectHook();

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

  useEffect(() => {
    if (projectIssues) {
      setData((prevData: any) => ({
        ...prevData,
        tasks: projectIssues.issues,
      }));
    }
  }, [projectIssues]);

  if (projectIssuesLoading) {
    return <Loading></Loading>;
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      return;
    }
    const cardObject = data.tasks.find(
      (card: any) => `k${card.issueId}` === draggableId
    );
    cardObject.status = finish.status;
    const newState = {
      ...data,
      columns: {
        ...data.columns,
      },
    };

    try {
      const payload = { ...cardObject, projectId: Number(id) ?? 0 };

      console.log({ payload });
      await updateIssueStatusProject(payload);
      toast.success("Issue updated successfully!");
    } catch (error) {
      toast.error("Failed to update issue. Please try again.");
    }

    setData(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-8 bg-gray-100 min-h-[50vh] overflow-x-auto select-none">
        {data.columnOrder.map((columnId: string) => {
          const column = data.columns[columnId];

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
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[100px]"
                  >
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
                            <SmallCard
                              title={task.title}
                              description={task.description}
                              color={mapColors(task.status)}
                            ></SmallCard>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Board;
