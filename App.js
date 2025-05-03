// app.js (CommonJS)
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const os = require("os");
const gdtLine = require("./utils/gdtUtils");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

// Utility functions
function formatDate(isoString) {
  return isoString.slice(0, 10).replace(/-/g, "");
}
function formatTime(isoString) {
  return isoString.slice(11, 19).replace(/:/g, "").slice(0, 6);
}

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { message: null });
});

app.post("/send", (req, res) => {
  const {
    nachname,
    vorname,
    geburtsdatum,
    versicherungsnummer,
    geschlecht,
    strasse,
    plz,
    medication,
    note,
    entryTime,
  } = req.body;

  const submissionTime = new Date().toISOString();

  const gdtContent = [
    gdtLine("0100", "841"),
    gdtLine("0101", "MEDIKAMENTENSYSTEM_X"),
    gdtLine("0102", formatDate(entryTime)),
    gdtLine("0103", formatTime(entryTime)),
    gdtLine("0104", formatDate(submissionTime)),
    gdtLine("0105", formatTime(submissionTime)),
    gdtLine("0201", versicherungsnummer),
    gdtLine("0202", nachname),
    gdtLine("0203", vorname),
    gdtLine("0204", geburtsdatum.replace(/-/g, "")),
    gdtLine("0205", geschlecht),
    gdtLine("3000", "Prescription Request"),
    gdtLine("4000", `Medication: ${medication}`),
    gdtLine("4001", `Note: ${note || ""}`),
    gdtLine("8000", "END"),
  ].join("\n");

  const filename = `REZEPT_${versicherungsnummer}.gdt`;

  const folderPath =
    process.platform === "darwin"
      ? "/Users/Shared/tomedo/gdt-import"
      : path.join(os.homedir(), "tomedo", "gdt-import");

  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, gdtContent, { encoding: "latin1" });

  const message = `Vielen Dank! ${nachname}, Ihr Rezeptwunsch wurde übermittelt.`;

  res.render("index", { message });
});

// Only listen if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
}

module.exports = app;