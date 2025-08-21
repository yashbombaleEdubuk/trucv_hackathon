// Using built-in fetch (Node.js 18+)

async function extractRefinedText() {
  try {
    console.log("🔍 Fetching refined CV data...\n");
    
    const response = await fetch('http://localhost:8000/api/refine-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    const refinedData = result.refinedCvData;

    console.log("=".repeat(80));
    console.log("                    REFINED CV DESCRIPTIONS");
    console.log("=".repeat(80));

    // Awards
    console.log("\n🏆 AWARDS:");
    console.log("-".repeat(50));
    refinedData.achievements.awards.forEach((award, index) => {
      console.log(`${index + 1}. ${award.award_name}:`);
      console.log(`   ${award.description}\n`);
    });

    // Courses
    console.log("📚 COURSES:");
    console.log("-".repeat(50));
    refinedData.achievements.courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.course_name}:`);
      console.log(`   ${course.description}\n`);
    });

    // Projects
    console.log("💻 PROJECTS:");
    console.log("-".repeat(50));
    refinedData.achievements.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name}:`);
      console.log(`   ${project.description}\n`);
    });

    // Experience
    console.log("💼 EXPERIENCE:");
    console.log("-".repeat(50));
    refinedData.experience.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.job_role} at ${exp.company_name}:`);
      console.log(`   ${exp.description}\n`);
    });

    // Profile Summary
    console.log("📝 PROFILE SUMMARY:");
    console.log("-".repeat(50));
    console.log(`${refinedData.profile_summary}\n`);

    console.log("=".repeat(80));
    console.log(`✅ Successfully refined ${result.originalDescriptionsCount} descriptions`);
    console.log("=".repeat(80));

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the extraction
extractRefinedText();
