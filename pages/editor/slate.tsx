import React, { useCallback, useMemo, useState, useEffect } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";

import escapeHtml from "escape-html";
import { Node, Text } from "slate";
import parse from "html-react-parser";
import { MarkButton, BlockButton, toggleMark, Separator } from "./Button";
import { Toolbar } from "./component";
import HoveringToolbar from "./hoverToolbar";
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const serialize = (node) => {
  if (Text.isText(node)) {
    return parseMark(node);
  }

  const children = node && node.children?.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "heading-three":
      return `<h3>${children}</h3>`;
    case "block-quote":
      return `<blockquote class="quote-block"><span>${children}</span></blockquote>`;
    case "bulleted-list":
      return `<ul class="list-block">${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "paragraph":
      return `<p class="text-block">${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    case "code-block":
      return `<code class="code-block">${children}</code>`;
    default:
      return `<p class="text-block">${children}</p>`;
  }
};

const parseMark = (node) => {
  if (node.bold) {
    return `<strong>${escapeHtml(node.text)}</strong>`;
  }
  if (node.italic) {
    return `<i>${escapeHtml(node.text)}</i>`;
  }
  if (node.underline) {
    return `<u>${escapeHtml(node.text)}</u>`;
  }

  return `${escapeHtml(node.text)}`;
};

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote className="quote-block" {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul className="list-block" {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "code-block":
      return (
        <code className="code-block" {...attributes}>
          {children}
        </code>
      );
    default:
      return (
        <p className="text-block" {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  // if (leaf.code) {
  //   children = <code className="code-block">{children}</code>;
  // }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const RichTextExample = ({ onChange }) => {
  const [value, setValue] = useState<any>(initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    onChange(value);
    console.log(JSON.stringify(value));
  }, [value]);

  return (
    <>
      <div
        style={{
          display: "none",
          position: "absolute",
          top: 0,
          left: 0,
          background: "white",
          padding: "24px",
        }}
      >
        {parse(serialize({ children: value }))}
      </div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <HoveringToolbar>
          <MarkButton format="bold" icon="ri-bold" />
          <MarkButton format="italic" icon="ri-italic" />
          <MarkButton format="underline" icon="ri-underline" />
          <Separator />
          <BlockButton format="code-block" icon="ri-code-view" />
          <BlockButton format="heading-one" icon="ri-h-1" />
          <BlockButton format="heading-two" icon="ri-h-2" />
          <BlockButton format="heading-three" icon="ri-h-3" />
          <BlockButton format="block-quote" icon="ri-double-quotes-l" />
          {/* <BlockButton format="numbered-list" icon="ri-list-ordered" /> */}
          <BlockButton format="bulleted-list" icon="ri-list-check" />
        </HoveringToolbar>
        {/* <Toolbar>
          <MarkButton format="bold" icon="ri-bold" />
          <MarkButton format="italic" icon="ri-italic" />
          <MarkButton format="underline" icon="ri-underline" />
          <Separator />
          <BlockButton format="code-block" icon="ri-code-view" />
          <BlockButton format="heading-one" icon="ri-h-1" />
          <BlockButton format="heading-two" icon="ri-h-2" />
          <BlockButton format="heading-three" icon="ri-h-3" />
          <BlockButton format="block-quote" icon="ri-double-quotes-l" />
          <BlockButton format="numbered-list" icon="ri-list-ordered" /> 
          <BlockButton format="bulleted-list" icon="ri-list-check" />
        </Toolbar> */}
        <Editable
          id="editor-content"
          style={{ padding: "20px" }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event: any) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
      <style jsx global>{`
        .code-block {
          display: block;
          background-color: rgba(0, 0, 0, 0.1);
          font-size: 16px;
          line-height: 1.5rem;
          color: rgb(131, 131, 133);
          margin-bottom: 12px;
          padding: 12px;
        }

        .text-block {
          font-size: 16px;
          color: #838385;
        }

        .list-block {
          font-size: 16px;
        }
        .quote-block {
          font-size: 16px;
          padding: 12px;
          border-left: 5px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

const initialValue = [
 
];

export default RichTextExample;
