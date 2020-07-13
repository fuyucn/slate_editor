import React, { useState } from "react";

import dynamic from "next/dynamic";
import parse from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
function QuillEditor() {
  const [value, setValue] = useState("");
  React.useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <>
      <ReactQuill
        theme="bubble"
        value={value}
        onChange={setValue}
        style={{ backgroundColor: "red" }}
      />
      {parse(value)}
    </>
  );
}

export default QuillEditor;
