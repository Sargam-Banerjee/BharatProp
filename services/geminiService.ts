
import { GoogleGenAI } from "@google/genai";
import { HouseQuery, PredictionResult, CityTrend, CityGuide } from "../types";

// Helper function to extract citations from search grounding
const extractGroundingSources = (response: any) => {
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Market Index",
      uri: chunk.web.uri
    }));
};

// Predict house price with real-time web grounding
export async function predictHousePrice(query: HouseQuery): Promise<PredictionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    PROPERTY VALUATION REPORT REQUEST:
    Locality: ${query.locality}
    City: ${query.city}
    Configuration: ${query.bhk}
    Total Area: ${query.area} sq ft
    Type: ${query.propertyType}
    Status: ${query.condition}

    ROLE: Chief Data Scientist at BharatProp.
    TASK: Use Google Search to find current property listings and trends.
    
    INSTRUCTIONS:
    - Provide a detailed narrative report.
    - Start with a clear "ESTIMATED VALUE: [Value in Lakhs/Crores]" line.
    - Include a "CONFIDENCE SCORE: [Percentage]%" line.
    - List 3-4 NEARBY LOCALITIES with their average rate in this exact format: "NEARBY: [Locality Name], PRICE: [Avg Price]"
    - Provide 5 historical or projected data points for a price chart in this format: "CHART: [Year/Quarter], VALUE: [Numerical Price per SqFt]"
    - Explain reasoning and sentiment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No data returned.";
    const sources = extractGroundingSources(response);
    
    // Extract Estimated Price and Confidence
    const priceMatch = text.match(/ESTIMATED VALUE:\s*([^\n\r]+)/i);
    const confidenceMatch = text.match(/CONFIDENCE SCORE:\s*(\d+)%/i);
    
    // Extract Nearby Localities
    const nearbyLocalities: { name: string; price: string }[] = [];
    const chartData: { label: string; value: number }[] = [];

    const lines = text.split('\n');
    lines.forEach(line => {
      const nearbyMatch = line.match(/NEARBY:\s*(.*?),\s*PRICE:\s*(.*)/i);
      if (nearbyMatch) {
        nearbyLocalities.push({ name: nearbyMatch[1].trim(), price: nearbyMatch[2].trim() });
      }

      const chartMatch = line.match(/CHART:\s*(.*?),\s*VALUE:\s*([\d,.]+)/i);
      if (chartMatch) {
        const val = parseFloat(chartMatch[2].replace(/,/g, ''));
        if (!isNaN(val)) {
          chartData.push({ label: chartMatch[1].trim(), value: val });
        }
      }
    });

    // Default chart data if AI fails to provide enough points
    const finalChartData = chartData.length >= 3 ? chartData : [
      { label: 'Q1 24', value: 4500 },
      { label: 'Q2 24', value: 4800 },
      { label: 'Q3 24', value: 5200 },
      { label: 'Q4 24', value: 5800 },
      { label: 'Live 25', value: 6200 },
    ];

    return { 
      report: text,
      estimatedPrice: priceMatch ? priceMatch[1].trim() : "Market Inquiry",
      confidenceScore: confidenceMatch ? parseInt(confidenceMatch[1]) : 85,
      groundingSources: sources,
      nearbyLocalities: nearbyLocalities,
      chartData: finalChartData
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Could not fetch real-time data for this locality.");
  }
}

export async function fetchMarketTrends(city: string): Promise<CityTrend> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Search for current real estate market trends for ${city}, India in 2025. Provide report on price per Sq Ft, growth, and status.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { city, report: response.text || "Trends report currently unavailable.", groundingSources: extractGroundingSources(response) };
  } catch (error: any) {
    console.error("Trends Error:", error);
    throw new Error(`Trends loading failed for ${city}: ${error.message || 'Unknown Error'}`);
  }
}

export async function fetchCityGuide(city: string): Promise<CityGuide> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create a 2025 Real Estate Investor Guide for ${city}, India. Best spots, infra, yield.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { cityName: city, report: response.text || "City guide currently unavailable.", groundingSources: extractGroundingSources(response) };
  } catch (error: any) {
    console.error("Guide Error:", error);
    throw new Error(`Guide loading failed for ${city}: ${error.message || 'Unknown Error'}`);
  }
}
