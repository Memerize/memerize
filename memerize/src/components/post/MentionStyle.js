export const mentionStyle = {
  control: {
    backgroundColor: "#fff",
    fontSize: 16,
    lineHeight: "1.5",
  },
  "&multiLine": {
    control: {
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      fontSize: 16,
      lineHeight: "1.5",
    },
    input: {
      padding: 9,
      fontSize: 16,
      lineHeight: "1.5",
    },
  },
  highlighter: {
    overflow: "hidden",
  },
  input: {
    border: "1px solid silver",
    overflow: "auto",
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 16,
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#f0f0f0",
      },
    },
  },
};
