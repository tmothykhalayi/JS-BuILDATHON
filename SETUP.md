# Setup Instructions

## 1. Install Dependencies
```bash
npm install
```

## 2. Set up GitHub Token
You need to set your GitHub Personal Access Token as an environment variable.

### For Windows (PowerShell):
```powershell
$env:GITHUB_TOKEN="your_github_token_here"
```

### For Windows (Command Prompt):
```cmd
set GITHUB_TOKEN=your_github_token_here
```

### For macOS/Linux (Bash):
```bash
export GITHUB_TOKEN="your_github_token_here"
```

## 3. Get GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes as needed for GitHub Models
4. Copy the token and use it in the environment variable

## 4. Download the Sketch Image
Download the image from: https://github.com/Azure-Samples/JS-AI-Build-a-thon/blob/assets/jsai-buildathon-assets/contoso_layout_sketch.jpg

Save it as `contoso_layout_sketch.jpg` in this directory.

## 5. Run the Application
```bash
npm start
```
or
```bash
node sample.js
```

## What the App Does
- Connects to GitHub Models API using your token
- Uses a multimodal AI model (gpt-4o-mini) to analyze images
- Converts hand-drawn sketches into HTML web pages
- Generates modern, responsive website code
- Saves the output as HTML files you can open in a browser
