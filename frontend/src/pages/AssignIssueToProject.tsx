import React, { useState } from "react";
import { useAssignIssueToProjectHook } from "../hooks/projectHook";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const AssignIssueToProject: React.FC = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    status: "",
    type: "",
    dueDate: "",
    detail: {
      attachments: [],
      testcase: [],
      testscenary: [],
      datatest: [],
      acceptance: [],
    },
  });

  const issueTypes = [
    "bug",
    "spike",
    "test case",
    "user history",
    "review",
    "chore",
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetailChange = (e: any, field: any) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        [field]: value.split(",").map((item: any) => item.trim()),
      },
    });
  };

  const { issueCreateLoading, issueCreateError, createProject } =
    useAssignIssueToProjectHook();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createProject(projectId, formData);
      toast.success("Issue created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create issue. Please try again.");
    }
  };

  if (issueCreateError) {
    toast.error("Failed to create issue. Please try again.");
  }

  if (issueCreateLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 space-y-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-indigo-600 text-center">
          Create New Issue
        </h1>
        <div className="space-y-4">
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
