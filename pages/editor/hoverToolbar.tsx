import { useSlate, ReactEditor } from "slate-react";
import { Transforms, Editor } from "slate";
import { Button, Icon, Toolbar, Menu } from "./component";
import { useRef, useEffect } from "react";
import { cx, css } from "emotion";
import { MarkButton, Separator, BlockButton } from "./Button";
import { Range } from "slate";

import dynamic from "next/dynamic";

const Portal = dynamic(
  () =>
    import("./component").then((r) => {
      console.log(r);
      return r.Portal;
    }),
  { ssr: false },
);

export default ({ ...props }) => {
  const ref = useRef();
  const editor = useSlate();

  useEffect(() => {
    const el: any = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <Menu
        ref={ref}
        {...props}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
      ></Menu>
    </Portal>
  );
};
