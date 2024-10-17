import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <ClipLoader color="#36d7b7" loading={true} size={50} />
  </div>
);

export default Loading;
