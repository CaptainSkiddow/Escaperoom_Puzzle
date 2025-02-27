// DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const errorMsg = document.getElementById('errorMsg');

// Video stream variable
let stream = null;

// Animation frame ID for drawing
let animationId = null;

// Function to start the webcam
function startWebcam() {
    // Request access to the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (mediaStream) {
            // Store the stream for later stopping
            stream = mediaStream;

            // Connect the stream to the video element
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
                // Start drawing to canvas once video is playing
                drawToCanvas();
            };

            // Update button states
            startBtn.disabled = true;
            stopBtn.disabled = false;
            errorMsg.textContent = '';
        })
        .catch(function (err) {
            errorMsg.textContent = 'Error accessing webcam: ' + err.message;
            console.error('Error accessing webcam:', err);
        });
}

// Function to stop the webcam
function stopWebcam() {
    if (stream) {
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;

        // Cancel the animation frame
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update button states
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

// Function to draw video to canvas
function drawToCanvas() {
    // Draw the current frame from video to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // draw a circle on the canvas
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // calculate how many red pixels are in the video
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //console.log(imageData.data[0]);
    console.log(imageData.data[1]);

    // let redPixels = 0;
    // for (let i = 0; i < imageData.data.length; i += 4) {
    //   if (imageData.data[i] > 200 && imageData.data[i + 1] < 100 && imageData.data[i + 2] < 100) {
    //     redPixels++;
    //   }
    // }

    //console.log('Red pixels:', redPixels);

    // Request the next frame if the stream is still active
    if (stream && stream.active) {
        animationId = requestAnimationFrame(drawToCanvas);
    }
}

// Event listeners for buttons
startBtn.addEventListener('click', startWebcam);
stopBtn.addEventListener('click', stopWebcam);