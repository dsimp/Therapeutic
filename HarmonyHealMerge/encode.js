const fs = require('fs');
const path = require('path');

const imgDir = 'C:\\Users\\simps\\.gemini\\antigravity\\brain\\49277b68-39ea-4711-ab15-7eeba3ca5be3';
const outDir = path.join(__dirname, 'src', 'game');

const imagesToEncode = [
    { name: 'avatarImage', file: 'futuristic_xray_avatar_1771968085372.png' },
    { name: 'beetrootImage', file: 'food_icon_beetroot_dark_1771975377430.png' },
    { name: 'chamomileImage', file: 'food_icon_chamomile_1771970183885.png' },
    { name: 'gingerImage', file: 'food_icon_ginger_1771970196874.png' },
    { name: 'garlicImage', file: 'food_icon_garlic_dark_1771974126864.png' },
    { name: 'spinachImage', file: 'food_icon_spinach_dark_1771974141787.png' },
    { name: 'lavenderImage', file: 'food_icon_lavender_dark_1771974155295.png' },
    { name: 'citrusImage', file: 'food_icon_citrus_dark_1771974169938.png' }
];

imagesToEncode.forEach(img => {
    const imgPath = path.join(imgDir, img.file);
    const outPath = path.join(outDir, `${img.name}.js`);
    
    try {
        const data = fs.readFileSync(imgPath);
        const b64 = data.toString('base64');
        const content = `export const ${img.name} = "data:image/png;base64,${b64}";\n`;
        fs.writeFileSync(outPath, content);
        console.log(`Successfully encoded ${img.name} to ${outPath}`);
    } catch (e) {
        console.error(`Error encoding ${img.name}:`, e.message);
    }
});
