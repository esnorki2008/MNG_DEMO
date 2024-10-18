import React from "react";
import { toast } from "react-toastify";
import MenuBar from "../components/MenuBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Doughnut } from "react-chartjs-2";
import { useFetchUserHook, useFetchUserProjectsHook } from "../hooks/userHook";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const items = [{ handler: "/project/create", title: "Create", icon: faPlus }];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { user, userLoading, userError } = useFetchUserHook();
  const { userProjects, userProjectsLoading, userProjectsError } =
    useFetchUserProjectsHook();

  if (userLoading || userProjectsLoading) {
    return <div className="text-center">Loading user data...</div>;
  }

  if (userProjectsError) {
    toast.error("Error fetching projects.");
    return <div className="text-center">Loading user data...</div>;
  }

  if (userError) {
    toast.error("Credentials error.");
    Cookies.remove("authToken");
    navigate("/login");
  }

  const calculateCompletionPercentage = (issues: any[]) => {
    const totalIssues = issues.length;
    const doneIssues = issues.filter((issue) => issue.status === "done").length;
    return (doneIssues / totalIssues) * 100;
  };

  const getDoughnutData = (issues: any[]) => {
    const doneIssues = issues.filter((issue) => issue.status === "done").length;
    const notDoneIssues = issues.length - doneIssues;

    return {
      labels: ["Done", "Not Done"],
      datasets: [
        {
          data: [doneIssues, notDoneIssues],
          backgroundColor: ["#4caf50", "#e0e0e0"], // Verde para "done", gris para "not done"
          hoverBackgroundColor: ["#388e3c", "#bdbdbd"],
        },
      ],
    };
  };

  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h4>Hello, it's nice to see you here!</h4>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
        {`${user?.name} ${user?.familyName}`}
      </h1>

      <MenuBar title="My Projects" items={items} />

      <div className="bg-white shadow-lg rounded-lg p-4 pt-0 md:p-6 md:pt-0 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {userProjects?.projects.map((project: any, key) => (
            <div
              key={key}
              className="border p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/project/${project.projectId}`)}
            >
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="mb-4">
                <h4 className="text-md font-semibold">Due Date:</h4>
                <p>{formatDate(project.dueDate)}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2">Issues Progress</h4>
                <Doughnut data={getDoughnutData(project.issues)} />

                <p className="mt-2 text-sm">
                  Completed:{" "}
                  <strong>
                    {calculateCompletionPercentage(project.issues).toFixed(2)}%
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
