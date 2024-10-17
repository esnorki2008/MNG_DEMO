import { faPlus, faTh, faUsers } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../components/MenuBar";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectDataHook, useProjectIssuesHook } from "../hooks/projectHook";
import Loading from "../components/Loading";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { projectData, projectDataLoading, projectDataError } =
    useProjectDataHook(Number(id) || 0);

  const { projectIssues, projectIssuesLoading, projectIssuesError } =
    useProjectIssuesHook(Number(id) || 0);

  const items = [
    { handler: `/project/assign/${id}`, title: "Assign", icon: faUsers },
    { handler: `/project/issue/create/${id}`, title: "Issue", icon: faPlus },
    { handler: `/project/${id}/board`, title: "Board", icon: faTh },
  ];

  if (projectDataLoading || projectIssuesLoading) {
    return <Loading />;
  }
  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <div className="w-full space-y-6 bg-white rounded-lg shadow-lg">
        <MenuBar title="" items={items} />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-indigo-600 text-center">
            {projectData?.name}
          </h1>
          <div className="bg-gray-100 p-4 mt-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">
              {projectData?.description}
            </h2>
            <p className="text-gray-600 mt-2">
              Estimated end date: {formatDate(projectData?.endDate)}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-10">
            <h2 className="text-2xl font-semibold text-gray-800">Issues</h2>
            <ul className="space-y-4 mt-4">
              {projectIssues.issues.map((issue: any, index: number) => (
                <li
                  onClick={() => navigate(`/issue/${id}/board`)}
                  key={index}
                  className="cursor-default hover:cursor-pointer bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-lg font-medium text-indigo-600">
                    {issue.title}
                  </h3>
                  <p> {issue.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
