import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { cvData } from "./cv-data.js";
import CVRefinementService from "./cvRefinementService.js";

dotenv.config();
const app = express();
const refinementService = new CVRefinementService();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({ message: "Health is ok!", cvData });
});

// New endpoint to refine CV descriptions using Gemini API
app.post("/api/refine-cv", async (req, res) => {
  try {
    console.log("🚀 Starting CV refinement process...");
    const result = await refinementService.refineCV(cvData);
    
    if (result.success) {
      res.json({
        message: "CV refined successfully!",
        originalDescriptionsCount: result.originalDescriptionsCount,
        refinementDetails: result.refinementDetails,
        refinedCvData: result.refinedCvData
      });
    } else {
      res.status(500).json({
        message: "CV refinement failed",
        error: result.error,
        originalCvData: result.originalCvData
      });
    }
  } catch (error) {
    console.error("Server error during CV refinement:", error);
    res.status(500).json({
      message: "Server error during CV refinement",
      error: error.message
    });
  }
});

// Endpoint to get original CV data
app.get("/api/cv-original", (req, res) => {
  return res.json({ message: "Original CV data", cvData });
});

// Endpoint to compare original vs refined descriptions
app.post("/api/compare-descriptions", async (req, res) => {
  try {
    const result = await refinementService.refineCV(cvData);
    
    if (result.success) {
      res.json({
        message: "Description comparison completed",
        originalDescriptionsCount: result.originalDescriptionsCount,
        comparisons: result.comparisons,
        refinementDetails: result.refinementDetails
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
  console.log("Available endpoints:");
  console.log("  GET  /                      - Health check + CV data");
  console.log("  GET  /api/cv-original       - Original CV data");
  console.log("  POST /api/refine-cv         - Refine CV descriptions with Gemini AI");
  console.log("  POST /api/compare-descriptions - Compare original vs refined descriptions");
});
