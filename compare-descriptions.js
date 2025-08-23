// Script to display before/after comparison of CV descriptions

async function showComparison() {
  try {
    console.log("🔍 Fetching comparison data...\n");
    
    const response = await fetch('http://localhost:8000/api/compare-descriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    console.log("=".repeat(100));
    console.log("                    BEFORE vs AFTER COMPARISON");
    console.log("=".repeat(100));

    result.comparisons.forEach((comp, index) => {
      console.log(`\n${index + 1}. ${comp.type.toUpperCase()} - ${comp.context}`);
      console.log("─".repeat(80));
      
      console.log("🔴 BEFORE (Original):");
      console.log(`   ${comp.original}\n`);
      
      console.log("🟢 AFTER (Refined):");
      console.log(`   ${comp.refined}\n`);
      
      console.log("📊 IMPROVEMENT:");
      console.log(`   Length: ${comp.original.length} → ${comp.refined.length} characters`);
      console.log(`   Status: ${comp.original !== comp.refined ? '✅ IMPROVED' : '❌ NO CHANGE'}`);
      console.log("=".repeat(100));
    });

    console.log(`\n🎉 Processed ${result.originalDescriptionsCount} descriptions successfully!`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the comparison
showComparison();
