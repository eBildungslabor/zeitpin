var timerGoing = false;
var timer,
    secondsLeft;

var ding = new Audio('https://cdn.glitch.com/2f709a08-d0d6-491a-821d-f2324191fe45%2Fding-1.mp3?v=1629498751873');

var iconColor = '27ae60';
if (document.cookie.indexOf('myColor') > -1) {
  iconColor = document.cookie
              .split('; ')
              .find(row => row.startsWith('myColor='))
              .split('=')[1];
  $('#color').val(`#${iconColor}`);
}

$('#time').change(() => {
  resetTimer();
  var t = $('#time').val();
  $('#current').text(t);
});

$('#start').click(() => {
  if (timerGoing) {
    resetTimer();
  } else {
    var t = secondsLeft > 0 ? secondsLeft : $('#time').val() * 60;
    startTimer(t);
  }
});

$('#color').change(() => {
  console.log($('#color').val());
  iconColor = $('#color').val().replace(/\#/g,'');
  document.cookie = `myColor=${iconColor}`;
  updateIcon();
})

$('#showSeconds').change(() => {
  updateIcon();
});

$('#pause').click(() => {
  timerGoing = false;
  clearInterval(timer);
  $('#pause').hide();
  $('#start').removeClass('stop');
  $('#start').text('start');
});

$('#info').click(() => {
  $('#hidden-info').toggle();
  if ($('#info').text() == 'schließen') {
    $('#info').text('info');
  } else {
    $('#info').text('schließen');
  }
});
 
const resetTimer = () => {
  $('#pause').hide();
  secondsLeft = 0;
  timerGoing = false;
  $('#start').removeClass('stop');
  $('#start').text('start');
  $('#timeLeft').html('ZeitPin');
  document.title = 'ZeitPin';
  clearInterval(timer);
  updateIcon();
}

const startTimer = (seconds) => { 
  $('#pause').show();
  secondsLeft = seconds;
  timerGoing = true;
  $('#start').addClass('stop');
  $('#start').text('stop');
  
  updateTimer(secondsLeft);
  
  timer = setInterval(() => {
    secondsLeft--;
    
    updateTimer(secondsLeft);
    
    if (secondsLeft == 0) {
      ding.play();
      resetTimer();
    }
  },1000);
}

const updateTimer = (secondsLeft) => {
  var minutes = Math.floor(secondsLeft / 60);
  var seconds = secondsLeft - (minutes * 60);
  var displaySeconds = `${seconds < 10 ? '0' : ''}${seconds}`;
  var message = `${minutes}:${displaySeconds}`;
  $('#timeLeft').text(message);
  document.title = message;
  updateIcon();
}

const linkForFavicon = document.querySelector(
  `head > link[rel='icon']`
);

const updateIcon = () => {
  var m = timerGoing ? Math.floor(secondsLeft / 60) : 'po';
  var s = timerGoing ? secondsLeft - (m * 60) : 'mo';
  var showSeconds = $('#showSeconds').is(':checked');
  if (showSeconds == true && m < 10) { m = `0${m}`; }
  if (showSeconds == true && s < 10) { s = `0${s}`; }
  var svg = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <text font-family="monospace" font-size="${
                  showSeconds ? 62 : 85
                }" style="fill%3A %23${iconColor}%3B">
                  <tspan x="0" y="${showSeconds ? 40 : 70}">${m}</tspan>
                  <tspan x="0" dy=".85em">${showSeconds ? s : ""}</tspan>
                </text>
              </svg>
            `.trim();
  linkForFavicon.setAttribute(`href`, `data:image/svg+xml,${svg}`);
}

updateIcon();