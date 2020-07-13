import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import React, { useState } from "react";

export default () => {
  const editor = React.useRef(null);
  const [value, setValue] = useState(
    EditorState.createWithContent(convertFromRaw(emptyContentState)),
  );

  React.useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <Editor
      style={{ background: "red", minHeight: "300px" }}
      ref={editor}
      editorState={value}
      onChange={(state) => {
        setValue(state);
      }}
    />
  );
};

const initialData = {
  blocks: [
    {
      key: "16d0k",
      text: "You can edit this text.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 23, style: "BOLD" }],
      entityRanges: [],
      data: {},
    },
    {
      key: "98peq",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "ecmnc",
      text:
        "Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        { offset: 0, length: 14, style: "BOLD" },
        { offset: 133, length: 9, style: "BOLD" },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "fe2gn",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "4481k",
      text:
        "With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        { offset: 34, length: 19, style: "BOLD" },
        { offset: 117, length: 4, style: "BOLD" },
        { offset: 68, length: 10, style: "ANYCUSTOMSTYLE" },
      ],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
};

const emptyContentState = {
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
    },
  ],
};
