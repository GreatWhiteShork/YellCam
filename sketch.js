p5.disableFriendlyErrors = true; 

var cam;
var fCam;
var curPhoto;
var runningVolume = 0;
var latestPhoto;
var displayTimer = 0;
var mult = 1;
var timeSet = 60;
var volArray = [200];
var volInd = 1;
var volLimit = 30;
var photoTimer = 12;
var curTimer = photoTimer;
var circleMask;

var tW, tH;
var volumeThreshold = 45;
var volThreshAdd = 15;

var takingPhoto = false; 
var cornerSize = 150;

function setup() { 

  circleMask = createGraphics(cornerSize, cornerSize);
  circleMask.fill(0,0,0,255);
  circleMask.circle(cornerSize/2, cornerSize/2,cornerSize);
cam = createCapture({
    audio: false, 
    video: {
facingMode: 'environment' 
   } 
});
  tH = cam.width * 4 * 1;
  tW = cam.height * 4 * 1.5;

  fCam = createCapture({
    audio: false, 
    video: {
      facingMode: 'user' 
    } 
  });
cam.hide(); 
fCam.hide();
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
      volArray[volInd++] = runningVolume;
      if ( volInd > volLimit) volInd = 0;
      
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

var volAverage = 0;
  for ( var i = 0, iL = volArray.length; i < iL; i++) {
    volAverage += volArray[i];
  } 
  volAverage /= volArray.length;
  volumeThreshold = volAverage + volThreshAdd;

if ( takingPhoto ) {
image(latestPhoto,0,0,tW, tH) ;
fill(255, 255,255, 0);
  if ( timeSet - displayTimer < 16 ) fill(255);
rect(0,0,tW, tH) 
if ( displayTimer-- < 0  ) takingPhoto = false;
return;
} 
image(curPhoto,0,0,tW, tH) ;
  var fCamImage = fCam.get(0,0,fCam.width,fCam.height);
  fCamImage.mask(circleMask);
  image(fCamImage,width-cornerSize*1,height-cornerSize*1.5,cornerSize*1,cornerSize*1.5);
  

// Source - https://stackoverflow.com/a/52952907
// Posted by Morphasis, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-02, License - CC BY-SA 4.0



fill(255,255,0);
  if ( runningVolume > volumeThreshold) fill(0,255,0);
rect(0,0,tW * runningVolume / 100, 30); 

if ( runningVolume > volumeThreshold ) {
  takePhoto() ; 
} else {
curTimer = photoTimer;
} 

  fill(255);
  rect(tW * volumeThreshold / 100, 0,5, 30);
 fill(255,0,0);
 // text(volInd, 50, 50);
  //text("avg:" +volAverage, 50,100);
 // text(runningVolume, 50,150);
} 



function takePhoto () {
  curTimer--;
  if ( curTimer > 0) return;
takingPhoto = true;
latestPhoto = curPhoto;
displayTimer = timeSet;
runningVolume = 0;
  curTimer = photoTimer;
saveCanvas('emily photo'+millis()+'.png' ) 
} 
