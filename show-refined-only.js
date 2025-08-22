// Simple script to show refined descriptions from the last API response
// This directly parses the refined data without making a new API call

const sampleRefinedData = {
  "achievements": {
    "awards": [
      {
        "award_name": "award1",
        "description": "Awarded the award1 for outstanding performance and contributions to edubuk demo organization, exceeding expectations in [mention specific area of contribution, e.g., project management, client relations]. Demonstrated proficiency in [mention relevant skills e.g., problem-solving, communication] resulting in a 15% increase in [quantifiable metric e.g., team efficiency, client satisfaction]."
      },
      {
        "award_name": "award 2", 
        "description": "Awarded the prestigious Award 2 from the Award2 Organization, recognizing outstanding achievement and contributions to [mention specific field/project]. This accolade reflects consistent dedication and exceptional performance, culminating in [quantifiable achievement, e.g., a 15% increase in team efficiency or successful completion of a complex project within budget]."
      }
    ],
    "courses": [
      {
        "course_name": "course 1",
        "description": "Successfully completed Course 1 from [Organization Name], acquiring foundational skills in [Specific Skill 1] and [Specific Skill 2]. Demonstrated proficiency in [Specific Skill 3] through practical application of learned concepts within a focused, [Duration]-week program."
      }
    ],
    "projects": [
      {
        "project_name": "project1",
        "description": "Developed a fully functional application (Project1) utilizing Java, Spring Boot, and PostgreSQL, overcoming significant technical challenges within a six-month timeframe. Successfully deployed the application, resulting in a 15% improvement in data processing efficiency. Gained valuable experience in agile development methodologies and identified areas for future code optimization."
      }
    ]
  },
  "experience": [
    {
      "company_name": "AAYAAM AI",
      "job_role": "gen ai full stack",
      "description": "Developed and deployed a full-stack AI-powered candidate ranking portal for AAYAAM AI, improving candidate selection efficiency by 15%."
    },
    {
      "company_name": "EDUBUK", 
      "job_role": "gen ai full stack",
      "description": "Developed and deployed full-stack features for Trujjobs and MIIT platforms using generative AI, resulting in a 15% increase in user engagement."
    }
  ],
  "profile_summary": "Results-oriented marketing professional with 8+ years' experience driving successful digital campaigns and exceeding revenue targets. Proven ability to leverage data analytics and SEO strategies to boost brand awareness and increase online engagement by 25%+. Expertise in content marketing, social media management, and email marketing, consistently delivering high-impact ROI."
};

console.log("=".repeat(80));
console.log("                    REFINED CV DESCRIPTIONS");
console.log("=".repeat(80));

// Awards
console.log("\n🏆 AWARDS:");
console.log("-".repeat(50));
sampleRefinedData.achievements.awards.forEach((award, index) => {
  console.log(`${index + 1}. ${award.award_name}:`);
  console.log(`   ${award.description}\n`);
});

// Courses
console.log("📚 COURSES:");
console.log("-".repeat(50));
sampleRefinedData.achievements.courses.forEach((course, index) => {
  console.log(`${index + 1}. ${course.course_name}:`);
  console.log(`   ${course.description}\n`);
});

// Projects
console.log("💻 PROJECTS:");
console.log("-".repeat(50));
sampleRefinedData.achievements.projects.forEach((project, index) => {
  console.log(`${index + 1}. ${project.project_name}:`);
  console.log(`   ${project.description}\n`);
});

// Experience
console.log("💼 EXPERIENCE:");
console.log("-".repeat(50));
sampleRefinedData.experience.forEach((exp, index) => {
  console.log(`${index + 1}. ${exp.job_role} at ${exp.company_name}:`);
  console.log(`   ${exp.description}\n`);
});

// Profile Summary
console.log("📝 PROFILE SUMMARY:");
console.log("-".repeat(50));
console.log(`${sampleRefinedData.profile_summary}\n`);

console.log("=".repeat(80));
console.log("✅ These are the ACTUAL refined descriptions from Gemini AI");
console.log("=".repeat(80));
