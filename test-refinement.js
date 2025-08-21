import fetch from 'node-fetch';

async function testCVRefinement() {
  try {
    console.log("🧪 Testing CV Refinement API...");
    console.log("📡 Sending POST request to /api/refine-cv");
    
    const response = await fetch('http://localhost:8000/api/refine-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log("\n✅ API Response received!");
    console.log(`📊 Refined ${result.originalDescriptionsCount} descriptions`);
    
    console.log("\n📋 Refinement Details:");
    result.refinementDetails.forEach((detail, index) => {
      console.log(`  ${index + 1}. ${detail.type.toUpperCase()}`);
      console.log(`     Context: ${detail.context}`);
      console.log(`     Length: ${detail.originalLength} → ${detail.refinedLength} chars`);
      console.log(`     Improved: ${detail.improved ? '✅' : '❌'}`);
    });

    console.log("\n🎉 Test completed successfully!");
    return result;

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return null;
  }
}

// Run the test
testCVRefinement();
