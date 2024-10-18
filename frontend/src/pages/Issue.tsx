import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { faTasks, faBug } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../components/MenuBar";
import Loading from "../components/Loading";
import axios from "axios";
import { createAttachmentIssue, getIssue } from "../services/projectService";
import { toast } from "react-toastify";

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

const Issue = () => {
  const { id } = useParams();
  const [issueData, setIssueData] = useState<IssueDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attachments, setAttachments] = useState<
    {
      description: string;
      title: string;
      url: string;
      type: string;
      key: string;
    }[]
  >(issueData?.detail.attachments ?? []);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>(""); // Para capturar el nombre del archivo
  const [title, setTitle] = useState<string>(""); // Para capturar el título del archivo
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await getIssue(Number(id));
        console.log(response);

        setIssueData(response);
        setAttachments(response.detail.attachments);
      } catch (error) {
        console.error("Error fetching issue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  const items = [
    {
      handler: `/project/${id}/board`,
      title: "Back to Board",
      icon: faTasks,
    },
  ];

  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    if (!description || !title) {
      toast.error("Please provide description and title for the attachment.");
      return;
    }

    try {
      const issueId = Number(id);
      const response = await createAttachmentIssue(issueId, {
        fileType: file.type,
        description,
        title,
      });

      const presignedUrl = response.presignedUrl;
      const s3Response = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (s3Response.status === 200) {
        setUploadStatus("File uploaded successfully!");

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

        setFile(null);
        setDescription("");
        setTitle("");
      } else {
        setUploadStatus("Error uploading file.");
      }
    } catch (error) {
      toast.error("Error uploading file.");
    }
  };

  if (!issueData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <div className="w-full space-y-6 bg-white rounded-lg shadow-lg">
        <MenuBar title="Issue Details" items={items} />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-indigo-600 text-center">
            {issueData.title}
          </h1>
          <div className="bg-gray-100 p-4 mt-8 rounded-lg shadow-sm">
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
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Attachment
            </h2>
            <input
              type="text"
              placeholder="Attachment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded-md w-full"
            />
            <textarea
              placeholder="Attachment Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded-md w-full"
            />

            <input type="file" onChange={handleFileChange} />
            <button
              onClick={handleUpload}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Upload Attachment
            </button>
            {uploadStatus && (
              <p className="text-indigo-600 mt-2">{uploadStatus}</p>
            )}
          </div>

          {attachments.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                Attachments
              </h2>
              <ul className="space-y-4 mt-4">
                {attachments.map((attachment, index) => (
                  <li
                    key={index}
                    className="cursor-pointer bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    onClick={() => window.open(attachment.url, "_blank")}
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
