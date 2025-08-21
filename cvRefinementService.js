import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

class CVRefinementService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  // Extract all descriptions from CV data
  extractDescriptions(cvData) {
    const descriptions = [];
    
    // Awards descriptions
    if (cvData.achievements?.awards) {
      cvData.achievements.awards.forEach((award, index) => {
        if (award.description) {
          descriptions.push({
            type: 'award',
            index: index,
            original: award.description,
            context: `Award: ${award.award_name} from ${award.awarding_organization}`
          });
        }
      });
    }

    // Courses descriptions
    if (cvData.achievements?.courses) {
      cvData.achievements.courses.forEach((course, index) => {
        if (course.description) {
          descriptions.push({
            type: 'course',
            index: index,
            original: course.description,
            context: `Course: ${course.course_name} from ${course.organization}`
          });
        }
      });
    }

    // Projects descriptions
    if (cvData.achievements?.projects) {
      cvData.achievements.projects.forEach((project, index) => {
        if (project.description) {
          descriptions.push({
            type: 'project',
            index: index,
            original: project.description,
            context: `Project: ${project.project_name}`
          });
        }
      });
    }

    // Experience descriptions
    if (cvData.experience) {
      cvData.experience.forEach((exp, index) => {
        if (exp.description) {
          descriptions.push({
            type: 'experience',
            index: index,
            original: exp.description,
            context: `Experience: ${exp.job_role} at ${exp.company_name}`
          });
        }
      });
    }

    // Profile summary
    if (cvData.profile_summary) {
      descriptions.push({
        type: 'profile_summary',
        index: 0,
        original: cvData.profile_summary,
        context: 'Profile Summary'
      });
    }

    return descriptions;
  }

  // Create refined prompt for Gemini
  createRefinementPrompt(description) {
    return `You are a professional CV writing expert. Refine the following description to be:

1. ATS-friendly with relevant keywords
2. Grammatically perfect and professionally written
3. Impactful and achievement-focused
4. Quantified where possible (use realistic numbers if none provided)
5. Action-oriented with strong verbs
6. Concise but comprehensive

Context: ${description.context}
Section Type: ${description.type}

Original Description: "${description.original}"

Please provide ONLY the refined description without any additional text or explanations:`;
  }

  // Refine single description using Gemini
  async refineDescription(description) {
    try {
      const prompt = this.createRefinementPrompt(description);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Error refining ${description.type} description:`, error);
      return description.original; // Return original if API fails
    }
  }

  // Apply refined descriptions back to CV data
  applyRefinedDescriptions(cvData, descriptions, refinedTexts) {
    const updatedCvData = JSON.parse(JSON.stringify(cvData)); // Deep clone

    descriptions.forEach((desc, index) => {
      const refinedText = refinedTexts[index];
      
      switch (desc.type) {
        case 'award':
          updatedCvData.achievements.awards[desc.index].description = refinedText;
          break;
        case 'course':
          updatedCvData.achievements.courses[desc.index].description = refinedText;
          break;
        case 'project':
          updatedCvData.achievements.projects[desc.index].description = refinedText;
          break;
        case 'experience':
          updatedCvData.experience[desc.index].description = refinedText;
          break;
        case 'profile_summary':
          updatedCvData.profile_summary = refinedText;
          break;
      }
    });

    return updatedCvData;
  }

  // Main function to refine entire CV
  async refineCV(cvData) {
    try {
      console.log("🔍 Extracting descriptions from CV data...");
      const descriptions = this.extractDescriptions(cvData);
      console.log(`📝 Found ${descriptions.length} descriptions to refine`);

      console.log("🤖 Sending descriptions to Gemini API for refinement...");
      const refinedTexts = [];
      
      // Process each description individually for better control
      for (let i = 0; i < descriptions.length; i++) {
        const desc = descriptions[i];
        console.log(`   Processing ${desc.type} ${i + 1}/${descriptions.length}...`);
        const refined = await this.refineDescription(desc);
        refinedTexts.push(refined);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log("✅ All descriptions refined successfully");
      console.log("🔄 Applying refined descriptions to CV data...");
      
      const refinedCvData = this.applyRefinedDescriptions(cvData, descriptions, refinedTexts);
      
      console.log("🎉 CV refinement completed!");
      return {
        success: true,
        originalDescriptionsCount: descriptions.length,
        refinedCvData: refinedCvData,
        refinementDetails: descriptions.map((desc, index) => ({
          type: desc.type,
          context: desc.context,
          originalLength: desc.original.length,
          refinedLength: refinedTexts[index].length,
          improved: refinedTexts[index] !== desc.original
        }))
      };

    } catch (error) {
      console.error("❌ Error during CV refinement:", error);
      return {
        success: false,
        error: error.message,
        originalCvData: cvData
      };
    }
  }
}

export default CVRefinementService;
