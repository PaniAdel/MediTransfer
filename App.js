import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";

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

  const gdtContent = `
    0100 841
    0101 MEDIKAMENTENSYSTEM_X
    0102 ${formatDate(entryTime)}          
    0103 ${formatTime(entryTime)}         
    0104 ${formatDate(submissionTime)}    
    0105 ${formatTime(submissionTime)}     
    0201 ${versicherungsnummer}
    0202 ${nachname}
    0203 ${vorname}
    0204 ${geburtsdatum.replace(/-/g, "")}
    0205 ${geschlecht}
    3000 Prescription Request
    4000 Medication: ${medication}
    4001 Note: ${note}
    8000 END
`.trim();

  const message = `Vielen Dank! ${nachname}, Ihr Rezeptwunsch wurde übermittelt.`;

  // Save it as a .gdt file
  const filename = `REZEPT_${versicherungsnummer}.gdt`;
  const filepath = path.join(__dirname, "output", filename);
  fs.writeFileSync(filepath, gdtContent, "utf-8");

  res.render("index", { message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
  //   console.log("Server is listening on  port " + PORT);
});
