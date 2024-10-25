import { useEffect, useState } from "react"; // Import hooks for side effects and state management
import { useParams } from "react-router-dom"; // Import hook to get route parameters
import { faTasks, faBug } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import MenuBar from "../components/MenuBar"; // Import the MenuBar component
import Loading from "../components/Loading"; // Import the Loading component for displaying a spinner
import axios from "axios"; // Import axios for making HTTP requests
import { createAttachmentIssue, getIssue } from "../services/projectService";
// Import service functions to handle project-related operations
import { toast } from "react-toastify"; // Import toast utility for notifications

interface IssueDetailProps {
  issueId: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  type: string;
  dueDate: string;
  detail: {
    attachments: {
      description: string;
      title: string;
      url: string;
      type: string;
      key: string;
    }[];
    testcase: string[];
    testscenary: string[];
    datatest: string[];
    acceptance: string[];
  };
}
// Define the structure of the issue detail object

const Issue = () => {
  const { id } = useParams(); // Get the issue ID from the route parameters
  const [issueData, setIssueData] = useState<IssueDetailProps | null>(null);
  // State to store issue details
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [attachments, setAttachments] = useState<
    {
      description: string;
      title: string;
      url: string;
      type: string;
      key: string;
    }[]
  >(issueData?.detail.attachments ?? []); // State to store the attachments
  const [file, setFile] = useState<File | null>(null); // State to manage the file to be uploaded
  const [description, setDescription] = useState<string>(""); // State to capture the file description
  const [title, setTitle] = useState<string>(""); // State to capture the file title
  const [uploadStatus, setUploadStatus] = useState<string>(""); // State to track the upload status

  useEffect(() => {
    const fetchIssueData = async () => {
      // Function to fetch issue data from the server
      try {
        const response = await getIssue(Number(id));
        // Fetch issue data by ID
        setIssueData(response); // Update issue data in state
        setAttachments(response.detail.attachments);
        // Update attachments in state
      } catch (error) {
        console.error("Error fetching issue data:", error);
        // Log error in case fetching fails
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchIssueData(); // Trigger data fetch on component mount
  }, [id]);

  if (loading) {
    return <Loading />; // Show loading spinner if data is being fetched
  }

  const items = [
    {
      handler: `/project/${id}/board`,
      title: "Back to Board",
      icon: faTasks,
    },
  ];
  // Array for menu items, such as "Back to Board"

  const formatDate = (isoDateString: string) => {
    // Function to format ISO date strings into readable format
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return formatted date
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file input change
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Set the selected file in state
    }
  };

  const handleUpload = async () => {
    // Function to handle file upload
    if (!file) {
      toast.error("Please select a file first.");
      // Show error if no file is selected
      return;
    }

    if (!description || !title) {
      toast.error("Please provide description and title for the attachment.");
      // Show error if description or title is missing
      return;
    }

    try {
      const issueId = Number(id); // Get the issue ID
      const response = await createAttachmentIssue(issueId, {
        fileType: file.type,
        description,
        title,
      });
      // Call service to create attachment for the issue

      const presignedUrl = response.presignedUrl;
      // Get presigned URL for file upload to S3
      const s3Response = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      // Upload the file to the presigned S3 URL

      if (s3Response.status === 200) {
        setUploadStatus("File uploaded successfully!");
        // Update status on successful upload

        setAttachments((prevAttachments) => [
          ...prevAttachments,
          {
            key: presignedUrl,
            description,
            title,
            type: file.type,
            url: presignedUrl.split("?")[0],
          },
        ]);
        // Update the list of attachments

        setFile(null); // Clear the file input
        setDescription(""); // Reset description input
        setTitle(""); // Reset title input
      } else {
        setUploadStatus("Error uploading file.");
        // Set error status if upload fails
      }
    } catch (error) {
      toast.error("Error uploading file.");
      // Show error message if there's an exception
    }
  };

  if (!issueData) {
    return <Loading />; // Show loading spinner if issue data is not available
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      {/* Outer container with styling */}
      <div className="w-full space-y-6 bg-white rounded-lg shadow-lg">
        <MenuBar title="Issue Details" items={items} />
        {/* Menu bar component with issue details title */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-indigo-600 text-center">
            {issueData.title}
          </h1>
          <div className="bg-gray-100 p-4 mt-8 rounded-lg shadow-sm">
            {/* Issue details section */}
            <h2 className="text-2xl font-semibold text-gray-800">Details</h2>
            <p className="text-gray-600 mt-2">{issueData.description}</p>
            <p className="text-gray-600 mt-2">
              Status:{" "}
              <span className="text-indigo-600">{issueData.status}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Type: <span className="text-indigo-600">{issueData.type}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Due Date: {formatDate(issueData.dueDate)}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-10">
            {/* File upload section */}
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Attachment
            </h2>
            <input
              type="text"
              placeholder="Attachment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // Update title in state
              className="mb-2 p-2 border border-gray-300 rounded-md w-full"
            />
            <textarea
              placeholder="Attachment Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // Update description in state
              className="mb-2 p-2 border border-gray-300 rounded-md w-full"
            />

            <input type="file" onChange={handleFileChange} />
            {/* File input */}
            <button
              onClick={handleUpload}
              // Trigger file upload
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Upload Attachment
            </button>
            {uploadStatus && (
              <p className="text-indigo-600 mt-2">{uploadStatus}</p>
              // Display upload status
            )}
          </div>

          {attachments.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-10">
              {/* Display attachments if any exist */}
              <h2 className="text-2xl font-semibold text-gray-800">
                Attachments
              </h2>
              <ul className="space-y-4 mt-4">
                {attachments.map((attachment, index) => (
                  <li
                    key={index}
                    className="cursor-pointer bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    onClick={() => window.open(attachment.url, "_blank")}
                    // Open the attachment URL in a new tab
                  >
                    <h1 className="text-lg font-medium text-indigo-600">
                      {attachment.title}
                    </h1>
                    <p className="font-small">{attachment.description}</p>
                    <p className="text-gray-600">{attachment.url}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issue;
// Export the Issue component
