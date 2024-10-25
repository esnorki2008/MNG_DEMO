import React, { useState } from "react"; // Import React and the useState hook
import { useNavigate, useParams } from "react-router-dom"; // Import hooks from React Router to handle navigation and route parameters
import { toast } from "react-toastify"; // Import the toast utility for notifications
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon for icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the arrow left icon
import Loading from "../components/Loading"; // Import the Loading component
import { useFetchUnassignedUsersToProjectHook } from "../hooks/userHook"; // Import a custom hook to fetch unassigned users
import { useAssignToProjectHook } from "../hooks/projectHook"; // Import a custom hook to assign users to a project

const AssignUserToProject: React.FC = () => {
  // Define a React functional component for assigning users to a project
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  // State for managing the selected user (initially an empty string)
  const navigate = useNavigate();
  // Hook for navigating between routes
  const { id } = useParams();
  // Hook to get the project ID from the URL
  const projectId = id;

  // Destructure values from the hook that fetches unassigned users
  const {
    usersUnassignedProjects,
    usersUnassignedProjectsLoading,
    usersUnassignedProjectsError,
  } = useFetchUnassignedUsersToProjectHook(projectId || "");

  // Destructure values from the hook that handles user assignment
  const { projectAssignLoading, projectAssignError, assignUserToProject } =
    useAssignToProjectHook();

  const handleAssignUser = async () => {
    // Function to handle the assignment of the selected user
    if (selectedUser && projectId) {
      // Check if a user is selected and the project ID exists
      try {
        await assignUserToProject(parseInt(projectId), selectedUser);
        // Call the function to assign the user to the project
        toast.success("User assigned successfully!");
        // Display success notification
        navigate("/dashboard");
        // Navigate to the dashboard after successful assignment
      } catch (error) {
        toast.error("Failed to assign user. Please try again.");
        // Display error notification in case of failure
      }
    } else {
      toast.error("Please select a user to assign.");
      // Display an error if no user is selected
    }
  };

  if (usersUnassignedProjectsError) {
    toast.error("Error fetching users.");
    // Display an error if there's an issue fetching unassigned users
  }

  if (usersUnassignedProjectsLoading || projectAssignLoading) {
    return <Loading />;
    // Show loading spinner while fetching users or assigning a user
  }

  if (projectAssignError) {
    toast.error("Error assigning users.");
    // Display an error if there's an issue with assigning the user
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Outer container with styling */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg relative">
        {/* Inner card containing form elements */}
        <button
          onClick={() => navigate(-1)}
          // Button to go back to the previous page
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:top-6 sm:left-6"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            // FontAwesome icon for the back button
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Assign User to Project
        </h2>
        {/* Header text for the form */}
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
              setSelectedUser(userId);
              // Update the selected user when a new option is chosen
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Choose a user
            </option>
            {/* Option placeholder */}
            {usersUnassignedProjects &&
              usersUnassignedProjects.users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} {user.familyName}
                </option>
                // Map through unassigned users and display them as options
              ))}
          </select>
        </div>
        <button
          onClick={handleAssignUser}
          // Button to trigger the user assignment
          className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Assign User
        </button>
      </div>
    </div>
  );
};

export default AssignUserToProject;
// Export the component as the default export
