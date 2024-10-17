import React from "react";
import { toast } from "react-toastify";
import MenuBar from "../components/MenuBar";
import SmallCard from "../components/SmallCard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LineBar from "../components/LineBar";
import { useFetchUserHook, useFetchUserProjectsHook } from "../hooks/userHook";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h4>Hello, is nice to see you here!</h4>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
        {`${user?.name} ${user?.familyName}`}
      </h1>

      <MenuBar title="My Projects" items={items} />

      <div className="bg-white shadow-lg rounded-lg p-4 pt-0 md:p-6 md:pt-0 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {userProjects?.projects.map((project: any, key) => (
            <SmallCard
              key={key}
              title={project.name}
              description={project.description}
              onClick={() => navigate(`/project/${project.projectId}`)}
            />
          ))}
        </div>
      </div>

      <LineBar title="My Issues" />
      <div className="bg-white shadow-lg rounded-lg p-4 pt-0 md:p-6 md:pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {userProjects?.projects.map((project: any, key) => (
            <SmallCard
              key={key}
              title={project.name}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
