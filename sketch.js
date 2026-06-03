p5.disableFriendlyErrors = true; 

var cam;
var curPhoto;
var runningVolume = 0;
var latestPhoto;
var displayTimer = 0;
var mult = 1;
var timeSet = 1;
var volArray = [];
var volInd = 0;

var tW, tH;
var volumeThreshold = 35;

var takingPhoto = false; 

function setup() { 

cam = createCapture({
    audio: false, 
    video: {
facingMode: 'environment' 
   } 
});
  tW = cam.width;
  tH = cam.height;
cam.hide(); 

createCanvas(tW, tH);
} 

function draw() {
curPhoto = cam.get(0,0, tW, tH);


if ( takingPhoto) {
image(latestPhoto,0,0,tW, tH) ;
fill(255, 255,255, 255);
rect(0,0,tW, tH) 
if ( displayTimer-- < 0  ) takingPhoto = false;
return;
} 
image(curPhoto,0,0,tW, tH) ; 

// Source - https://stackoverflow.com/a/52952907
// Posted by Morphasis, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-02, License - CC BY-SA 4.0

navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
})
  .then(function(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1); 

    analyser.smoothingTimeConstant = 0.2;
    analyser.fftSize = 1024; 

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function() {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const arraySum = array.reduce((a, value) => a + value, 0);
      runningVolume = arraySum / array.length;
      // volArray[volIndex++] = runningVolume;
    
      
     // console.log(Math.round(average));
      // colorPids(average);
    };
  })
  .catch(function(err) {
    /* handle the error */
    console.error(err);
  }); 

fill(255,0,0);
  if ( runningVolume > volumeThreshold) fill(0,255,0);
rect(0,0,windowWidth * runningVolume / 100, 30); 

if ( runningVolume > volumeThreshold ) takePhoto() ; 

} 



function takePhoto () {
takingPhoto = true;
latestPhoto = curPhoto;
displayTimer = timeSet;
runningVolume = 0;
save(latestPhoto, 'emily photo'+millis()+'.png' ) 
} 
