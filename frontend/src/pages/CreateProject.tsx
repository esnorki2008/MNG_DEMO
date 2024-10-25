import React, { useState } from "react"; // Import React and the useState hook
import { toast } from "react-toastify"; // Import the toast utility for notifications
import { useNavigate } from "react-router-dom"; // Import hook from React Router for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon for icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the arrow left icon
import { useCreateProjectHook } from "../hooks/projectHook"; // Import custom hook for creating a project
import Loading from "../components/Loading"; // Import the Loading component

const CreateProject: React.FC = () => {
  // Define a React functional component for creating a project
  const [name, setName] = useState<string>(""); // State for project name
  const [description, setDescription] = useState<string>(""); // State for project description
  const [startDate, setStartDate] = useState<string>(""); // State for project start date
  const [endDate, setEndDate] = useState<string>(""); // State for project end date
  const navigate = useNavigate(); // Hook for navigation

  const { projectLoading, createNewProject } = useCreateProjectHook();
  // Destructure values from the custom hook for project creation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Event handler for form submission
    e.preventDefault(); // Prevent the default form submission behavior

    const projectData = {
      name,
      description,
      startDate,
      endDate,
    };
    // Object to hold the project data

    try {
      await createNewProject(projectData);
      // Call the function to create a new project
      toast.success("Project created successfully!");
      // Display success notification
      navigate("/dashboard");
      // Navigate to the dashboard after project creation
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      // Display error notification in case of failure
    }
  };

  if (projectLoading) {
    return <Loading />;
    // Display loading spinner if the project is being created
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
          Create New Project
        </h2>
        {/* Header text for the form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form to create a new project */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // Update the project name in state
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Project Zeta"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // Update the project description in state
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="A project focused on database migration."
              required
            />
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // Update the project start date in state
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // Update the project end date in state
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Project
          </button>
          {/* Button to submit the form */}
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
// Export the component as the default export
