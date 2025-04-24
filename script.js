document.addEventListener("DOMContentLoaded", () => {
  // Screen Attributes
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const debugCanvas = document.getElementById("debug-canvas");
  const ctx = canvas.getContext("2d");
  const debugCtx = debugCanvas.getContext("2d");

  video.width = 640;
  video.height = 480;
  canvas.width = video.width;
  canvas.height = video.height;
  debugCanvas.width = 160;
  debugCanvas.height = 120;

  // Total Pixels
  const totalPixelsElement = document.getElementById("total-pixels");

  let totalPixels = 0;
  let defaultRatio = 0;
  let totalCompleted = 0;

  // Red
  const redPixelCountElement = document.getElementById("red-pixel-count");
  const redPercentageElement = document.getElementById("red-percentage");
  const redProgressBar = document.getElementById("progress-bar");

  let redPixelCount = 0;
  let redRatio = 0;
  let redCondition = 65 / 100 // Percentage for Completion
  var redCompleted = false;

  // Green
  const greenPixelCountElement = document.getElementById("green-pixel-count");
  const greenPercentageElement = document.getElementById("green-percentage");
  const greenProgressBar = document.getElementById("green-progress-bar");

  let greenPixelCount = 0;
  let greenRatio = 0;
  let greenCondition = 65 / 100 // Percentage for Completion
  var greenCompleted = false;

  // Blue
  const bluePixelCountElement = document.getElementById("blue-pixel-count");
  const bluePercentageElement = document.getElementById("blue-percentage");
  const blueProgressBar = document.getElementById("blue-progress-bar");

  let bluePixelCount = 0;
  let blueRatio = 0;
  let blueCondition = 65 / 100 // Percentage for Completion
  var blueCompleted = false;

  // Windows XP Bar
  const XpProgressBar = document.getElementsByClassName("xp_progressbar_inner");

  currentRatio = defaultRatio;

  function analyzeFrame() {
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Create debug image data
    const debugImageData = debugCtx.createImageData(
      debugCanvas.width,
      debugCanvas.height
    );
    const debugPixels = debugImageData.data;

    redPixelCount = 0;
    bluePixelCount = 0;
    greenPixelCount = 0;
    totalPixels = canvas.width * canvas.height;

    const sampleRate = video.width / debugCanvas.width;

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const i = (y * canvas.width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2]; // Deze values eerder in de code zetten

        const isRed = isRedPixel(r, g, b);
        if (isRed) {
          redPixelCount++;
        }

        const isBlue = isBluePixel(r, g, b);
        if (isBlue) {
          bluePixelCount++;
        }

        const isGreen = isGreenPixel(r, g, b);
        if (isGreen) {
          greenPixelCount++;
        }

        // Update debug view (downsampled)
        if (x % sampleRate < 1 && y % sampleRate < 1) {
          const debugX = Math.floor(x / sampleRate);
          const debugY = Math.floor(y / sampleRate);
          const debugI = (debugY * debugCanvas.width + debugX) * 4;

          if (isRed) {
            // Highlight red pixels in bright red
            debugPixels[debugI] = 255;      // R
            debugPixels[debugI + 1] = 0;    // G
            debugPixels[debugI + 2] = 0;    // B
            debugPixels[debugI + 3] = 255;  // A
          }
          if (isGreen) {
            debugPixels[debugI] = 0;        // R
            debugPixels[debugI + 1] = 255;  // G
            debugPixels[debugI + 2] = 0;    // B
            debugPixels[debugI + 3] = 255;  // A
          }
          if (isBlue) {
            debugPixels[debugI] = 0;        // R
            debugPixels[debugI + 1] = 0;    // G
            debugPixels[debugI + 2] = 255;  // B
            debugPixels[debugI + 3] = 255;  // A

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
    greenRatio = greenPixelCount / totalPixels;
    blueRatio = bluePixelCount / totalPixels;

    totalPixelsElement.textContent = totalPixels.toLocaleString();

    // Red
    redPixelCountElement.textContent = redPixelCount.toLocaleString();
    redPercentageElement.textContent = (redRatio * 100).toFixed(2) + "%";
    redProgressBar.style.width = (redRatio * 100).toFixed(2) + "%";

    // Green
    greenPixelCountElement.textContent = greenPixelCount.toLocaleString();
    greenPercentageElement.textContent = (greenRatio * 100).toFixed(2) + "%";
    greenProgressBar.style.width = (greenRatio * 100).toFixed(2) + "%";

    // Blue
    bluePixelCountElement.textContent = bluePixelCount.toLocaleString();
    bluePercentageElement.textContent = (blueRatio * 100).toFixed(2) + "%";
    blueProgressBar.style.width = (blueRatio * 100).toFixed(2) + "%";

    if (redRatio > redCondition) {
      redCompleted = true;
      console.log("Red completed!");
      alert("Red completed!");
    }

    if (greenRatio > greenCondition) {
      greenCompleted = true;
      console.log("Green completed!");
      alert("Green completed!");
    }

    if (blueRatio > blueCondition) {
      blueCompleted = true;
      console.log("Blue completed!");
      alert("Blue completed!");
    }

    function switchRatio() {
      if ((redCompleted = true)) {
        currentRatio = blueRatio;
      } else if ((blueCompleted = true)) {
        currentRatio = greenRatio;
      } else if ((greenCompleted = true)) {
        alert("All colors completed!");
      }
    }

    switchRatio();

    requestAnimationFrame(analyzeFrame);
  }

  // Function to determine if a pixel is red
  function isRedPixel(r, g, b) {
    const isRedDominant = r > g && r > b;
    const redDifference = r - Math.max(g, b);
    return isRedDominant && redDifference > 20;
  }

  // Function to determine if a pixel is green
  function isGreenPixel(r, g, b) {
    const isGreenDominant = g > r && g > b;
    const greenDifference = g - Math.max(r, b);
    return isGreenDominant && greenDifference > 20;
  }

  // Function to determine if a pixel is blue
  function isBluePixel(r, g, b) {
    const isBlueDominant = b > r && b > g;
    const blueDifference = b - Math.max(r, g);
    return isBlueDominant && blueDifference > 20;
  }

  function updateXPProgressBar()
  {
    const numBoxes = XpProgressBar[0].children.length; // Total number of green box divs in the XP bar
    let currentCompleted = 0;

    if (!redCompleted) {
      // Update progress based on red completion percentage
      currentCompleted = Math.floor((redRatio / redCondition) * (numBoxes / 3));
    } else if (!blueCompleted) {
      // Update progress based on blue completion percentage
      currentCompleted = Math.floor((blueRatio / blueCondition) * (numBoxes / 3) + (numBoxes / 3));
    } else if (!greenCompleted) {
      // Update progress based on green completion percentage
      currentCompleted = Math.floor((greenRatio / greenCondition) * (numBoxes / 3) + ((2 * numBoxes) / 3));
    }

    totalCompleted = Math.max(totalCompleted, currentCompleted);

    // Update the display of the loading bar
    const boxes = XpProgressBar[0].children;
    for (let i = 0; i < boxes.length; i++) {
      if (i < currentCompleted) {
        boxes[i].style.backgroundColor = "green";
      } else {
        boxes[i].style.backgroundColor = "transparent"; // Empty boxes
      }
    }

    // Check whether all progress is complete
    if (redCompleted && blueCompleted && greenCompleted) {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].style.backgroundColor = "gold"; // Entire bar turns gold
      }
    }
  }

  // Call the update function periodically or after every frame processing
  setInterval(updateXPProgressBar, 100);

  navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          analyzeFrame();
        };
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        alert("Error accessing webcam: " + error.message);
      });
});
