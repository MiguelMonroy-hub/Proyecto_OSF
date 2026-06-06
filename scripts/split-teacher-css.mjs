import fs from "fs";

const css = fs.readFileSync("css/teacher-dashboard.css", "utf8").split(/\r?\n/);
const head = css.slice(0, 365).join("\n");
const table = css.slice(365, 537).join("\n");
const detail = css.slice(537, 830).join("\n");
const modal = css.slice(830).join("\n");
fs.writeFileSync("css/teacher-table.css", table);
fs.writeFileSync("css/teacher-detail.css", detail);
fs.writeFileSync("css/teacher-modal.css", modal);
fs.writeFileSync(
  "css/teacher-dashboard.css",
  head +
    "\n\n@import url(\"teacher-table.css\");\n@import url(\"teacher-detail.css\");\n@import url(\"teacher-modal.css\");\n"
);
console.log("css split ok");
