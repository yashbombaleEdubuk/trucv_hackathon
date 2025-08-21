# TruCV Hackathon - CV Refinement API

## Overview
This project provides an API to refine CV descriptions using Google's Gemini AI, making them ATS-friendly, grammatically correct, and professionally formatted.

## Features
- ✅ Extract descriptions from CV data automatically
- ✅ Refine text using Gemini Pro AI model
- ✅ ATS-friendly keyword optimization
- ✅ Grammar and spelling correction
- ✅ Professional formatting and tone
- ✅ Quantified achievements where possible

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `.env` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=8000
```

### 3. Start the Server
```bash
npm run dev
```

## API Endpoints

### GET /
- **Description**: Health check + original CV data
- **Response**: JSON with CV data

### GET /api/cv-original
- **Description**: Get original CV data
- **Response**: Original CV data

### POST /api/refine-cv
- **Description**: Refine CV descriptions using Gemini AI
- **Response**: Refined CV data with improvement details

## How It Works

### Step 1: Description Extraction
The system automatically identifies all description fields:
- Awards descriptions
- Course descriptions  
- Project descriptions
- Experience descriptions
- Profile summary

### Step 2: AI Processing
Each description is sent to Gemini AI with context-aware prompts:
- Section type (award, course, project, experience)
- Context information (company name, role, etc.)
- Specific refinement instructions

### Step 3: Text Refinement
Gemini AI improves the text by:
- Fixing grammar and spelling errors
- Adding relevant ATS keywords
- Making content more professional
- Quantifying achievements
- Using action-oriented language

### Step 4: Data Integration
Refined descriptions are integrated back into the CV structure while preserving all other data.

## Example Usage

### Test the API
```bash
# Start server
npm run dev

# Test refinement (in another terminal)
curl -X POST http://localhost:8000/api/refine-cv
```

### Response Format
```json
{
  "message": "CV refined successfully!",
  "originalDescriptionsCount": 7,
  "refinementDetails": [
    {
      "type": "award",
      "context": "Award: award1 from edubuk demo organization",
      "originalLength": 150,
      "refinedLength": 180,
      "improved": true
    }
  ],
  "refinedCvData": { ... }
}
```

## Error Handling
- API rate limiting with delays
- Graceful fallback to original text
- Comprehensive error logging
- Detailed error responses

## Rate Limiting
- 500ms delay between API calls
- Automatic retry on failures
- Preserves original data on errors

## Security
- Environment variables for API keys
- No hardcoded credentials
- Error message sanitization
