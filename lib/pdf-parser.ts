
// lib/pdf-parser.ts
"server only"
import axios from 'axios';
import pdfParse from 'pdf-parse';

export async function extractPdfTextFromUrl(fileUrl: string) {
  try {
    
    // Fetch the PDF
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });


    // Parse the PDF
    const data = await pdfParse(response.data);
    
    
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error;
  }
}