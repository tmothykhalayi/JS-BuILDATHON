import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// GitHub Models endpoint and token
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";

if (!token) {
    console.error("Error: GITHUB_TOKEN environment variable not set");
    process.exit(1);
}

// Initialize the client
const client = new ModelClient(endpoint, new AzureKeyCredential(token));

// Use a multimodal model that can process images
const modelName = "gpt-4o-mini"; // This is a multimodal model

async function convertSketchToWebpage() {
    try {
        // Check if the sketch image exists
        const imagePath = path.join(process.cwd(), "contoso_layout_sketch.jpg");
        
        if (!fs.existsSync(imagePath)) {
            console.log("Image not found. Creating a basic sample without image...");
            return await basicTextExample();
        }

        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        console.log("🖼️ Processing hand-drawn sketch to create web page...");

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Please analyze this hand-drawn website sketch and create a complete HTML page with embedded CSS that recreates the layout. Make it modern, responsive, and visually appealing. Include proper semantic HTML structure."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                model: modelName,
                temperature: 0.7,
                max_tokens: 2000
            }
        });

        if (response.status !== "200") {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = response.body;
        const htmlContent = result.choices[0]?.message?.content;

        if (htmlContent) {
            // Save the generated HTML
            fs.writeFileSync("generated_website.html", htmlContent);
            console.log("✅ Generated website saved as 'generated_website.html'");
            console.log("🎨 Generated HTML content:");
            console.log(htmlContent);
        }

        return htmlContent;

    } catch (error) {
        console.error("Error:", error);
        return await basicTextExample();
    }
}

async function basicTextExample() {
    console.log("🤖 Running basic text generation example...");
    
    try {
        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful web development assistant."
                    },
                    {
                        role: "user", 
                        content: "Create a simple HTML page for a company called Contoso with a header, navigation, main content area, and footer. Make it modern and responsive."
                    }
                ],
                model: modelName,
                temperature: 0.7,
                max_tokens: 1500
            }
        });

        if (response.status !== "200") {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = response.body;
        const content = result.choices[0]?.message?.content;

        console.log("✅ AI Response:");
        console.log(content);

        // Save as HTML file
        if (content) {
            fs.writeFileSync("basic_website.html", content);
            console.log("💾 Saved as 'basic_website.html'");
        }

        return content;

    } catch (error) {
        console.error("❌ Error in basic example:", error);
        throw error;
    }
}

// Main execution
async function main() {
    console.log("🚀 Starting GitHub Models AI Prototype");
    console.log(`📡 Using model: ${modelName}`);
    console.log(`🔑 Token configured: ${token ? '✅ Yes' : '❌ No'}`);
    
    await convertSketchToWebpage();
    
    console.log("🎉 Quest completed! Don't forget to:");
    console.log("1. Set your GITHUB_TOKEN environment variable");
    console.log("2. Run: npm install @azure-rest/ai-inference @azure/core-auth");
    console.log("3. Download the contoso_layout_sketch.jpg image");
    console.log("4. Push your code to GitHub");
}

// Run the main function
main().catch(console.error);
