import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

class CVRefinementService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    console.log(`🔑 API Key configured: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Configure model with system instruction
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "***Important Instruction:** Do not add any new information or additional details to the user-provided description. Only improve the given description by making it ATS-friendly, enhancing clarity, grammar, structure, and formatting. The final output must strictly use only the information provided by the user without inventing or assuming new details."
    });
    console.log(`🤖 Using model: gemini-1.5-flash with system instruction`);
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
4. Action-oriented with strong verbs
5. Concise but comprehensive

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

  // Apply refined descriptions back to CV data with original descriptions preserved
  applyRefinedDescriptions(cvData, descriptions, refinedTexts) {
    const updatedCvData = JSON.parse(JSON.stringify(cvData)); // Deep clone

    descriptions.forEach((desc, index) => {
      const refinedText = refinedTexts[index];
      const originalText = desc.original;
      
      switch (desc.type) {
        case 'award':
          updatedCvData.achievements.awards[desc.index].description_original = originalText;
          updatedCvData.achievements.awards[desc.index].description_refined = refinedText;
          updatedCvData.achievements.awards[desc.index].description = refinedText; // Keep main field as refined
          break;
        case 'course':
          updatedCvData.achievements.courses[desc.index].description_original = originalText;
          updatedCvData.achievements.courses[desc.index].description_refined = refinedText;
          updatedCvData.achievements.courses[desc.index].description = refinedText;
          break;
        case 'project':
          updatedCvData.achievements.projects[desc.index].description_original = originalText;
          updatedCvData.achievements.projects[desc.index].description_refined = refinedText;
          updatedCvData.achievements.projects[desc.index].description = refinedText;
          break;
        case 'experience':
          updatedCvData.experience[desc.index].description_original = originalText;
          updatedCvData.experience[desc.index].description_refined = refinedText;
          updatedCvData.experience[desc.index].description = refinedText;
          break;
        case 'profile_summary':
          updatedCvData.profile_summary_original = cvData.profile_summary;
          updatedCvData.profile_summary_refined = refinedText;
          updatedCvData.profile_summary = refinedText;
          break;
      }
    });

    return updatedCvData;
  }

  // Helper function to extract comparison data
  extractComparisonData(originalCvData, refinedCvData) {
    const comparisons = [];
    
    // Awards comparisons
    if (originalCvData.achievements?.awards) {
      originalCvData.achievements.awards.forEach((award, index) => {
        if (award.description) {
          comparisons.push({
            type: 'award',
            context: `Award: ${award.award_name}`,
            original: award.description,
            refined: refinedCvData.achievements.awards[index].description_refined
          });
        }
      });
    }

    // Courses comparisons
    if (originalCvData.achievements?.courses) {
      originalCvData.achievements.courses.forEach((course, index) => {
        if (course.description) {
          comparisons.push({
            type: 'course',
            context: `Course: ${course.course_name}`,
            original: course.description,
            refined: refinedCvData.achievements.courses[index].description_refined
          });
        }
      });
    }

    // Projects comparisons
    if (originalCvData.achievements?.projects) {
      originalCvData.achievements.projects.forEach((project, index) => {
        if (project.description) {
          comparisons.push({
            type: 'project',
            context: `Project: ${project.project_name}`,
            original: project.description,
            refined: refinedCvData.achievements.projects[index].description_refined
          });
        }
      });
    }

    // Experience comparisons
    if (originalCvData.experience) {
      originalCvData.experience.forEach((exp, index) => {
        if (exp.description) {
          comparisons.push({
            type: 'experience',
            context: `Experience: ${exp.job_role} at ${exp.company_name}`,
            original: exp.description,
            refined: refinedCvData.experience[index].description_refined
          });
        }
      });
    }

    // Profile summary comparison
    if (originalCvData.profile_summary) {
      comparisons.push({
        type: 'profile_summary',
        context: 'Profile Summary',
        original: originalCvData.profile_summary,
        refined: refinedCvData.profile_summary_refined
      });
    }

    return comparisons;
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
      let updatedCvData = cvData;

      console.log("✅ All descriptions refined successfully");
      console.log("🔄 Applying refined descriptions to CV data...");
      
      const refinedCvData = this.applyRefinedDescriptions(cvData, descriptions, refinedTexts);
      const comparisons = this.extractComparisonData(cvData, refinedCvData);
      
      console.log("🎉 CV refinement completed!");
      return {
        success: true,
        originalDescriptionsCount: descriptions.length,
        originalCvData: cvData,
        refinedCvData: refinedCvData,
        comparisons: comparisons,
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
