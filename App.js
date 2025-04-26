import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";
import gdtLine from "./utils/gdtUtils.js";

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");

// Utility functions to format timestamps
function formatDate(isoString) {
  return isoString.slice(0, 10).replace(/-/g, ""); // e.g., 2025-04-19 -> 20250419
}

function formatTime(isoString) {
  return isoString.slice(11, 19).replace(/:/g, "").slice(0, 6); // e.g., 14:22:10 -> 142210
}

// __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const submissionTime = new Date().toISOString(); // Current time
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

    // Save it as a .gdt file
    const filename = `REZEPT_${versicherungsnummer}.gdt`;
    const filepath = path.join(__dirname, "output", filename);
    fs.writeFileSync(filepath, gdtContent, { encoding: "latin1" });

    const message = `Vielen Dank! ${nachname}, Ihr Rezeptwunsch wurde übermittelt.`;

  res.send(`
    <h2>Ihre GDT-Datei wurde erstellt</h2>
    <pre>${gdtContent}</pre>
    <a href="/">Zurück zur Startseite</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
  //   console.log("Server is listening on  port " + PORT);
});
