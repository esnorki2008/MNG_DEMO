import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";
import { useFetchUnassignedUsersToProjectHook } from "../hooks/userHook";
import { useAssignToProjectHook } from "../hooks/projectHook";

const AssignUserToProject: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const navigate = useNavigate();
  const { id } = useParams();
  const projectId = id;

  const {
    usersUnassignedProjects,
    usersUnassignedProjectsLoading,
    usersUnassignedProjectsError,
  } = useFetchUnassignedUsersToProjectHook(projectId || "");

  const { projectAssignLoading, projectAssignError, assignUserToProject } =
    useAssignToProjectHook();

  const handleAssignUser = async () => {
    if (selectedUser && projectId) {
      try {
        await assignUserToProject(parseInt(projectId), selectedUser);
        toast.success("User assigned successfully!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to assign user. Please try again.");
      }
    } else {
      toast.error("Please select a user to assign.");
    }
  };

  if (usersUnassignedProjectsError) {
    toast.error("Error fetching users.");
  }

  if (usersUnassignedProjectsLoading || projectAssignLoading) {
    return <Loading />;
  }

  if (projectAssignError) {
    toast.error("Error assigning users.");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:top-6 sm:left-6"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Assign User to Project
        </h2>
        <div>
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            Select User
          </label>
          <select
            id="user"
            value={selectedUser === "" ? "" : selectedUser}
            onChange={(e) => {
              const userId =
                e.target.value !== "" ? parseInt(e.target.value) : "";
              console.log({ userId });

              setSelectedUser(userId);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Choose a user
            </option>
            {usersUnassignedProjects &&
              usersUnassignedProjects.users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} {user.familyName}
                </option>
              ))}
          </select>
        </div>
        <button
          onClick={handleAssignUser}
          className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Assign User
        </button>
      </div>
    </div>
  );
};

export default AssignUserToProject;
