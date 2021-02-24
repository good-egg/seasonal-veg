const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const images = ['carrots', 'apples-braeburn', 'squash'];
const imagesToFlip = ['carrots'];
// const imagesToJitter = ['apples-braeburn', 'butternut-squash'];

const width = 640;
const height = 360;

images.forEach(async (food) => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    await loadImages(food)
    .then(({ image, imageFlip }) => {
        const numberOfRows = Math.floor(height / image.height);
        const numberOfColumns = Math.floor(width / image.width);
        let flip = false;
        for (let x = 0; x < numberOfColumns; x++) {
            let xPosition = ((width / numberOfColumns) * x);
            // if (imagesToJitter.includes(food)) xPosition += Math.random() * 20 - 10;
            for (let y = 0; y < numberOfRows; y++) {
                let yPosition = ((height / numberOfRows) * y);
                // if (imagesToJitter.includes(food)) yPosition += Math.random() * 20 - 10;
                flip = !flip;
                context.drawImage(flip && imageFlip ? imageFlip : image, xPosition, yPosition, image.width, image.height);
            }  
        }
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`${__dirname}/../source/app/assets/img/generated-images/${food}.png`, buffer);
    })
});

async function loadImages(food) {
    const image = await loadImage(`${__dirname}/../source/app/assets/img/${food}.svg`);
    let imageFlip = false;
    if (imagesToFlip.includes(food)) imageFlip = await loadImage(`${__dirname}/../source/app/assets/img/flipped-images/flipped_${food}.svg`)
    return { image, imageFlip };
}


