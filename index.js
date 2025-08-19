import express from "express";
import bodyParser from "body-parser";
import { cvData } from "./cv-data.js";
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({ message: "Health is ok!", cvData });
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
