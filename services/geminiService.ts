
import { GoogleGenAI, Type } from "@google/genai";
import { Donor, EmergencyRequest, BloodGroup } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * FEATURE 2: EMERGENCY SITUATION ANALYSIS
   */
  async analyzeEmergency(request: EmergencyRequest, donors: Donor[]) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Analyze this LifeLink emergency blood request:
          Request Details: ${JSON.stringify(request)}
          Available compatible donors in network: ${donors.filter(d => d.bloodGroup === request.bloodGroup && d.available).length}
          
          Provide:
          1. Criticality assessment.
          2. Fulfillment prediction.
          3. Short action recommendation.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              criticality: { type: Type.STRING },
              fulfillmentPrediction: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["criticality", "fulfillmentPrediction", "recommendation"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Emergency Analysis failed", error);
      return { 
        criticality: "Standard Emergency Protocol", 
        fulfillmentPrediction: "Local network scan active", 
        recommendation: "Proceed with standard broadcast" 
      };
    }
  },

  /**
   * FEATURE 3: PREDICTIVE BLOOD DEMAND
   */
  async predictShortages(requests: EmergencyRequest[], donors: Donor[]) {
    try {
      const simplifiedHistory = requests.map(r => ({ bg: r.bloodGroup, ts: r.timestamp }));
      const donorInventory = donors.reduce((acc, d) => {
        acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
        return acc;
      }, {} as any);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Analyze LifeLink medical emergency data:
          Inventory: ${JSON.stringify(donorInventory)}
          History: ${JSON.stringify(simplifiedHistory.slice(-50))}

          Task:
          1. Predict which blood group will be in critical shortage next month.
          2. Suggest an awareness campaign title.
          3. Rate regional risk (Low, Moderate, Critical).
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictedShortageGroup: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              growthForecast: { type: Type.STRING },
              campaignIdea: { type: Type.STRING }
            },
            required: ["predictedShortageGroup", "riskLevel", "growthForecast", "campaignIdea"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Predictive AI failed", error);
      return null;
    }
  }
};
