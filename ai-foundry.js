import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Azure AI Foundry configuration
const endpoint = process.env.AZURE_INFERENCE_SDK_ENDPOINT;
const apiKey = process.env.AZURE_INFERENCE_SDK_KEY;

// Check if credentials are properly configured
if (!endpoint || !apiKey) {
    console.error("❌ Error: Azure AI Foundry credentials not configured properly");
    console.log("📝 Please update your .env file with:");
    console.log("   AZURE_INFERENCE_SDK_ENDPOINT=your_endpoint_here");
    console.log("   AZURE_INFERENCE_SDK_KEY=your_api_key_here");
    process.exit(1);
}

// Initialize the client
const client = new ModelClient(endpoint, new AzureKeyCredential(apiKey));

async function chatWithAzureAI() {
    try {
        console.log("🚀 Starting Azure AI Foundry chat completion...");
        console.log(`📡 Endpoint: ${endpoint}`);
        console.log(`🔑 API Key configured: ${apiKey ? '✅ Yes' : '❌ No'}`);

        const messages = [
            { role: "system", content: "You are a helpful assistant specializing in web development and Azure services." },
            { role: "user", content: "What are the key benefits of deploying AI models to Azure AI Foundry compared to using them locally?" },
        ];

        const response = await client.path("/chat/completions").post({
            body: {
                messages: messages,
                max_tokens: 800,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                model: "gpt-4o-mini", // Using the same model as GitHub Models
            },
        });

        if (response.status !== "200") {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = response.body;
        const content = result.choices[0]?.message?.content;

        console.log("✅ Azure AI Foundry Response:");
        console.log("=" .repeat(50));
        console.log(content);
        console.log("=" .repeat(50));
        
        return content;

    } catch (error) {
        console.error("❌ Error calling Azure AI Foundry:", error);
        throw error;
    }
}

// Main execution
async function main() {
    console.log("🎯 Quest 2: Azure AI Foundry Integration");
    console.log("🌟 Moving AI prototype from GitHub Models to Azure AI Foundry");
    
    await chatWithAzureAI();
    
    console.log("\n🎉 Quest 2 completed! Your AI prototype is now connected to Azure AI Foundry!");
    console.log("📋 Next steps:");
    console.log("1. Configure your Azure AI Foundry credentials in .env file");
    console.log("2. Test the connection with: node ai-foundry.js");
    console.log("3. Push your code to GitHub to complete the quest");
}

// Run the main function
main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});
