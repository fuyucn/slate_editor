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
  {
    type: "heading-one",
    children: [
      {
        text:
          "Learn Powerful Negotiation Techniques & Hear Recent Real-life Experiences for Tech & Business Roles",
      },
    ],
  },
  { type: "heading-two", children: [{ text: "About this Event" }] },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Please join Women in Big Data and TalentSeer on 7/22/20 6 - 7:30 pm PT for a live panel discussion on Negotiating Your Compensation Package. You’ll hear recent real-life experiences from people in technical and business roles, pragmatic techniques from career coaches, as well as useful insights from studies conducted in the tech industry.",
      },
    ],
  },
  { type: "heading-two", children: [{ text: "Agenda" }] },
  {
    type: "bulleted-list",
    children: [
      { type: "list-item", children: [{ text: "Introductions" }] },
      {
        type: "list-item",
        children: [{ text: "Why Is It Important to Negotiate?" }],
      },
      {
        type: "list-item",
        children: [{ text: "How to Prepare for a Negotiation" }],
      },
      {
        type: "list-item",
        children: [{ text: "How and When to Ask for What You Want?" }],
      },
      {
        type: "list-item",
        children: [{ text: "How Do You Counter Accept or Decline an Offer?" }],
      },
      { type: "list-item", children: [{ text: "Resources & Tools" }] },
      { type: "list-item", children: [{ text: "Q&A" }] },
    ],
  },
  { type: "heading-two", children: [{ text: "Speakers" }] },
  { type: "heading-three", children: [{ text: "Marie Goodell" }] },
  {
    type: "paragraph",
    children: [{ text: "Marketing Executive and Consultant" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "After 30-years in technology with leadership marketing roles at SAP, Oracle, Adobe, and IBM, Marie retired from full-time work. She now mentors technology companies (especially start-ups) through the Lazaridis Institute ScaleUp program and consults with other technology companies in the Bay Area. In a shift to health & wellness, Marie supports individual & group health and wellness as a certified yoga therapist & yoga instructor. Marie is also Secretary of the Board for the IYI San Francisco and Chair of the Board for the Accessible Yoga Organization.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "heading-three", children: [{ text: "Lorry Tang" }] },
  {
    type: "paragraph",
    children: [{ text: "Head of Talent Development @ TalentSeer" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Lorry is currently leading TalentSeer, the fastest-growing AI Talent Search Firm in the bay area. With the experience of working with more than 100 top AI startups in autonomous driving, speech recognition, machine learning platform, and cloud, Lorry has expertise in startup talent strategy, talent market analysis, recruiting management, and offer negotiation. For the past three years, she helped more than 400 top Engineers/Product Managers/Business Development executives to join startups and Pre-IPO companies for Senior leadership/C-level roles.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "heading-three", children: [{ text: "Sunita Sharma" }] },
  {
    type: "paragraph",
    children: [
      { text: "Founding Member of Women in Big Data, Mentor, Author" },
    ],
  },
  { type: "paragraph", children: [{ text: "Big Data Specialist @ AWS" }] },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Sunita is a founding member of Women in Big Data. She has over 18 years of experience in the IT industry. She worked in various technologies with multiple roles in development, design and architecting solutions. Currently, She is a Big Data Specialist at Amazon Web Services. She is very passionate about learning new technology and applying that knowledge to help the community. She loves gardening and going for long walks with her dog.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "heading-three", children: [{ text: "Tina Tang" }] },
  {
    type: "paragraph",
    children: [{ text: "Co-founder & Chair of Women in Big Data" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "Head of Global Innovation Marketing Strategy and GTM @ EY" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Named one of Datanami’s People to Watch in 2020, Tina is a co-founder of Women in Big Data. She has over 20 years of experience in the high technology industry and holds degrees from the University of Texas at Austin. Tina is head of Global Innovation marketing at EY, a board member at MinasList.org, and advises startups on marketing strategy. She and her husband have three grown sons. The couple lives in Palo Alto with a cat, 100,000 bees, a multi-generational jackrabbit family, and two donkeys.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "heading-three", children: [{ text: "Regina Karson" }] },
  {
    type: "paragraph",
    children: [
      { text: "Board Member & Chapter Director of Women in Big Data" },
    ],
  },
  { type: "paragraph", children: [{ text: "Technical Marketing" }] },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Regina has both a technical and business background educationally and professionally. She has held roles in technical marketing, business development, sales, and engineering. In addition to her WiBD duties, Regina is a SAP.iO mentor (SAP startup incubator) and works on go-to-market strategies and execution and business development for cutting edge technologies such as AI/ML for Fortune 500+ companies.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "heading-two", children: [{ text: "About Women In Big Data" }] },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Women in Big Data is a 16K+/6 continents global organization aimed at inspiring, connecting, and championing the success of women in big data.",
      },
    ],
  },
  { type: "heading-two", children: [{ text: "About TalentSeer" }] },
  {
    type: "paragraph",
    children: [
      {
        text:
          "TalentSeer is a fast-growing Tech talent partner in the U.S. providing integrated talent acquisition, market research, and employer branding services. With an engaged tech community, an innovative recruiting approach, and deep domain knowledge, TalentSeer has helped with 150 partners across autonomous driving, internet, finance, retail, and healthcare industries to build strong engineering & business teams.",
      },
    ],
  },
];

export default RichTextExample;
