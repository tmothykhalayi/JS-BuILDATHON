import https from 'https';
import fs from 'fs';

const imageUrl = 'https://github.com/Azure-Samples/JS-AI-Build-a-thon/raw/assets/jsai-buildathon-assets/contoso_layout_sketch.jpg';
const fileName = 'contoso_layout_sketch.jpg';

console.log('Downloading image...');

function downloadImage(url, fileName) {
    const file = fs.createWriteStream(fileName);
    
    https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
            console.log('Following redirect...');
            downloadImage(response.headers.location, fileName);
            return;
        }
        
        if (response.statusCode !== 200) {
            console.error(`Failed to download image. Status code: ${response.statusCode}`);
            return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
            file.close();
            console.log(`✅ Image downloaded successfully as ${fileName}`);
        });
        
        file.on('error', (err) => {
            fs.unlink(fileName, () => {}); // Delete the file on error
            console.error('Error downloading image:', err.message);
        });
    }).on('error', (err) => {
        console.error('Error downloading image:', err.message);
    });
}

downloadImage(imageUrl, fileName);
