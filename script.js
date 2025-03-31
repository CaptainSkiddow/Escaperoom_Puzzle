document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const debugCanvas = document.getElementById('debug-canvas');
    const ctx = canvas.getContext('2d');
    const debugCtx = debugCanvas.getContext('2d');

    const redPixelCountElement = document.getElementById('red-pixel-count');
    const totalPixelsElement = document.getElementById('total-pixels');
    const redPercentageElement = document.getElementById('red-percentage');

    const progressBar = document.getElementById('progress-bar');

    const bluePixelCountElement = document.getElementById('blue-pixel-count');
    const bluePercentageElement = document.getElementById('blue-percentage');

    const blueProgressBar = document.getElementById('blue-progress-bar');

    const greenPixelCountElement = document.getElementById('green-pixel-count');
    const greenPercentageElement = document.getElementById('green-percentage');

    const XpProgressBar = document.getElementsByClassName('xp_progressbar_inner');

    let currentRatio;

    video.width = 640;
    video.height = 480;
    canvas.width = video.width;
    canvas.height = video.height;
    debugCanvas.width = 160;
    debugCanvas.height = 120;

    let redPixelCount = 0;
    let totalPixels = 0;
    let redRatio = 0;
    let redThreshold = 150;
    let ratioThreshold = 1.5;


    // Function to determine if a pixel is red
    function isRedPixel(r, g, b) {
        return r > redThreshold && r > g * ratioThreshold && r > b * ratioThreshold;
    }

    // Function to determine if a pixel is blue
    function isBluePixel(r, g, b) {
        return b > redThreshold && b > r * ratioThreshold && b > g * ratioThreshold;
    }

    // Function to determine if a pixel is green
    function isGreenPixel(r, g, b) {
        return g > redThreshold && g > r * ratioThreshold && g > b * ratioThreshold;
    }

    function analyzeFrame() {
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Create debug image data
        const debugImageData = debugCtx.createImageData(debugCanvas.width, debugCanvas.height);
        const debugPixels = debugImageData.data;

        // Reset counters
        redPixelCount = 0;
        totalPixels = (canvas.width * canvas.height);

        // Sample rate for debug view (show 1 out of every X pixels)
        const sampleRate = video.width / debugCanvas.width;

        // Count red pixels
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                // Check if this is a red pixel
                const isRed = isRedPixel(r, g, b);
                if (isRed) {
                    redPixelCount++;
                }

                // Update debug view (downsampled)
                if (x % sampleRate < 1 && y % sampleRate < 1) {
                    const debugX = Math.floor(x / sampleRate);
                    const debugY = Math.floor(y / sampleRate);
                    const debugI = (debugY * debugCanvas.width + debugX) * 4;

                    if (isRed) {
                        // Highlight red pixels in bright red
                        debugPixels[debugI] = 255;     // R
                        debugPixels[debugI + 1] = 0;   // G
                        debugPixels[debugI + 2] = 0;   // B
                        debugPixels[debugI + 3] = 0; // A
                    } else {
                        // Show other pixels in grayscale
                        const gray = (r + g + b) / 3;
                        debugPixels[debugI] = gray;
                        debugPixels[debugI + 1] = gray;
                        debugPixels[debugI + 2] = gray;
                        debugPixels[debugI + 3] = 255;
                    }
                }
            }
        }

        debugCtx.putImageData(debugImageData, 0, 0);

        redRatio = redPixelCount / totalPixels;

        redPixelCountElement.textContent = redPixelCount.toLocaleString();
        totalPixelsElement.textContent = totalPixels.toLocaleString();
        redPercentageElement.textContent = (redRatio * 100).toFixed(2) + '%';

        progressBar.style.width = (redRatio * 100).toFixed(2) + '%';
        currentRatio = (redRatio);


        if (redRatio > 0.7) {
            // een if functie om de hoeveelheid blauw-ratio te verifieren, en daarna groen te analyseren. 



        }

        checkBluePixels();
        checkGreenPixels();

        requestAnimationFrame(analyzeFrame);
    }

    function checkBluePixels() {
        let bluePixelCount = 0;

        // Get image data again
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Count blue pixels
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                if (isBluePixel(r, g, b)) {
                    bluePixelCount++;
                }
            }
        }

        // Calculate blue ratio
        const blueRatio = bluePixelCount / totalPixels;

        // Update UI with blue pixel count and percentage
        bluePixelCountElement.textContent = bluePixelCount.toLocaleString();
        bluePercentageElement.textContent = (blueRatio * 100).toFixed(2) + '%';

        // Update blue progress bar width
        blueProgressBar.style.width = (blueRatio * 100).toFixed(2) + '%';

        // Log blue pixel data (optional)
        //console.log(`Blue Pixels: ${bluePixelCount}`);
        //console.log(`Blue Ratio: ${(blueRatio * 100).toFixed(2)}%`);
    }

    // Function to check green pixels
    function checkGreenPixels() {
        let greenPixelCount = 0;

        // Get image data again
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Count green pixels
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                if (isGreenPixel(r, g, b)) {
                    greenPixelCount++;
                    console.log(greenPixelCount);
                }

            }
        }

        // Calculate green ratio
        const greenRatio = greenPixelCount / totalPixels;

        // Update UI with green pixel count and percentage
        greenPixelCountElement.textContent = greenPixelCount.toLocaleString();
        greenPercentageElement.textContent = (greenRatio * 100).toFixed(2) + '%';

    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();

            video.onloadedmetadata = () => {
                analyzeFrame();
            };
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
            alert('Error accessing webcam: ' + error.message);
        });
});

function updateXpBar() {
    XpProgressBar.style.width = (currentRatio * 100).toFixed(2) + '%';
}

updateXpBar();





