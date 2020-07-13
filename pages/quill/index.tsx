// Import React dependencies.
import React, { useState } from "react";
// import { Editable, withReact, useSlate, Slate } from 'slate-react';
// import { Editor, Transforms, createEditor, Block, Text } from 'slate';
import { DatePicker, TimePicker, Button } from "antd";
import moment from "moment";
import "./index.less";
import QuillEditor from "./quill";
export default () => {
  const [content, setContent] = useState<any>({});

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      setContent({ ...content, banner_url: window.URL.createObjectURL(file) });
    }
  };

  return (
    // Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: "20px", left: "20px" }}>
        <Button onClick={() => {}}>Convert</Button>
      </div>
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          minHeight: "100vh",
          backgroundColor: "white",
        }}
      >
        <div className="banner">
          <div className="banner-container">
            {content.banner_url && (
              <img
                className="banner-upload-image"
                src={content.banner_url}
              ></img>
            )}
            <label className="banner-upload-container" htmlFor="banner-upload">
              <div>
                <i className="ri-upload-line" style={{ display: "block" }}></i>
                <span style={{ fontSize: "16px", display: "block" }}>
                  UPLOAD IMAGE
                </span>
              </div>
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              id="banner-upload"
              multiple={false}
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                uploadFile(e);
              }}
            />
          </div>
        </div>
        <div style={{ padding: "0 20px" }}>
          <input
            className="title-input"
            value={content.title}
            placeholder={"TITLE PLACEGOLDER"}
            style={{}}
            onChange={(e) => {
              setContent({ ...content, title: e.target.value });
            }}
          />
          <div style={{ width: "100%" }}>
            <DatePicker
              style={{ display: "inline-block", marginRight: "12px" }}
              onChange={(date, datestring) => {
                console.log(date, datestring);
                setContent({
                  ...content,
                  time: { ...content.time, date: datestring },
                });
              }}
            />
            <TimePicker.RangePicker
              picker="time"
              onChange={(dates, dateStrings) => {
                dateStrings[0] &&
                  dateStrings[1] &&
                  setContent({
                    ...content,
                    time: {
                      start: moment(dates[0]),
                      end: moment(dates[1]),
                    },
                  });
              }}
            />
          </div>
          {/* <div>
            {content.time
              ? moment(content.time.date).format("LL") +
                " | " +
                moment(content.time.start).format("LTS") +
                " - " +
                moment(content.time.end).format("LTS") +
                " PDT"
              : null}
          </div> */}
        </div>
        {/* QUILL */}
        <QuillEditor />
      </div>
    </div>
  );
};
