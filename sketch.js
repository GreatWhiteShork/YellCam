p5.disableFriendlyErrors = true; 

var cam;
var curPhoto;
var runningVolume = 0;
var latestPhoto;
var displayTimer = 0;
var mult = 1;
var timeSet = 60;
var volArray = [];
var volInd = 0;

var tW, tH;
var volumeThreshold = 45;

var takingPhoto = false; 

function setup() { 

cam = createCapture({
    audio: false, 
    video: {
facingMode: 'environment' 
   } 
});
  tH = cam.width * 3 * 2;
  tW = cam.height * 3 * 1;
cam.hide(); 

createCanvas(tW, tH);

  navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
})
  .then(function(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1); 

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024; 

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function() {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const arraySum = array.reduce((a, value) => a + value, 0);
      runningVolume = arraySum / array.length;
      volArray[volIndex++] = runningVolume;
      //if ( volIndex > 14) volIndex = 0;
      
     // console.log(Math.round(average));
      // colorPids(average);
    };
  })
  .catch(function(err) {
    /* handle the error */
    console.error(err);
  }); 
} 

function draw() {
curPhoto = cam.get(0,0, cam.width, cam.height );


if ( takingPhoto) {
image(latestPhoto,0,0,tW, tH) ;
fill(255, 255,255, 0);
  if ( timeSet - displayTimer < 16 ) fill(255);
rect(0,0,tW, tH) 
if ( displayTimer-- < 0  ) takingPhoto = false;
return;
} 
image(curPhoto,0,0,tW, tH) ; 
  

// Source - https://stackoverflow.com/a/52952907
// Posted by Morphasis, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-02, License - CC BY-SA 4.0



fill(255,0,0);
  if ( runningVolume > volumeThreshold) fill(0,255,0);
rect(0,0,tW * runningVolume / 100, 30); 

if ( runningVolume > volumeThreshold ) takePhoto() ; 

  fill(255);
  rect(tW * volumeThreshold / 100, 0,5, 30);
 fill(255,0,0);
  text(volArray.length, 50, 50);
} 



function takePhoto () {
takingPhoto = true;
latestPhoto = curPhoto;
displayTimer = timeSet;
runningVolume = 0;
save(latestPhoto, 'emily photo'+millis()+'.png' ) 
} 
