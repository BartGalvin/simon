var audioCtx = new AudioContext();
var activeSound, nextPad, count, timeout, optionalZero, playerCount, series, playerSeries;
var on = false;
var strict = false;
var playing = false;
var dur = 500;
var pads = ['green', 'red', 'yellow', 'blue'];
var timeouts = [];

$('.slider').click(function() {
  on = !on;
  if (on) {
    $('.button').addClass('clickable');
    series = [];
    $('.count').html('--');
  } else {
    clearAllTimeouts();
    $('.count').html('');
    $('.button').removeClass('clickable');
    $('.strict-indicator').removeClass('strict-on');
    strict = false;
    activeSound.stop();
    playing = false;
  }
});
$(document).on('click', '.strict-button.clickable', function() {
  if (count <= 1) {
    strict = !strict;
    $('.strict-indicator').toggleClass('strict-on');
  }
});

$(document).on('click', '.start-button.clickable', function() {
  clearAllTimeouts();
  makeUnclickable('.start-button');
  series = [];
  count = 0;
  playing = true;
  play();
});

function play(correct) {
  clearAllTimeouts();
  $('.gamepad').removeClass('clickable');
  if (correct || count === 0) {
    nextPad = pads[Math.floor(Math.random() * 4)];
    series.push(nextPad);
  }
  count = series.length;
  if (count < 10) {
    optionalZero = '0';
  } else {
    optionalZero = '';
  }
  setTimeout(function() {
    $('.count').html(optionalZero + count.toString());
  }, dur - 100);

  var interval = 0;
  timeouts = [];
  for (var i = 0; i < series.length; i++) {
    interval += dur + 100;
    var padSelector = $('#' + series[i]);
    timeouts.push(setTimeout(activatePad, interval, padSelector, true));
  }
  playerSeries = [];
  playerCount = 0;
setTimeout(function(){
  $('.gamepad').addClass('clickable');
}, interval + dur);
  
  return;
}
$(document).on('click', '.gamepad.clickable', function() {
  if (playing) {
    var pushed = $(this).attr('id');
    playerCount++;
    playerSeries.push(pushed);
    if ((playerSeries[playerCount - 1] != series[playerCount - 1]) && playing) {
      $('.gamepad').removeClass('.clickable');
      error();
      if (strict) {
        series = [];
        count = 0;
        $('.count').html('ERR');
      }
      setTimeout(play, 2000, false);
    } else if (series.length >= 20 && playerSeries[19] == series[19]) {
      $('.count').html('WIN');
      series = [];
      count = 0;
      setTimeout(play, 3000);
    } else if (playerCount >= count) {
      
      play(true);
    }
  }
});

function error(strictBool) {
  $('.gamepad').removeClass('clickable');
  var flashcount = 0;
  var delay = 0;
  while (flashcount < 4) {
    setTimeout(flashOn, delay);
    delay += 200;
    setTimeout(flashOff, delay);
    delay += 200;
    flashcount++;
  }

}

function flashOn() {
  $('.gamepad').addClass('active');
  if (!strict) {
    $('.count').html('--');
  }
}

function flashOff() {
  $('.gamepad').removeClass('active');
  if (!strict) {
    $('.count').html('');
  }
}

$(document).on({
  mousedown: function() {
    if (activeSound !== undefined){
      activeSound.stop();
    }
    activatePad($(this));
  },
  mouseup: function() {
    deactivatePad($(this));
    
  },
  mouseleave: function() {
    deactivatePad($(this));
  }
}, '.gamepad.clickable');

function activatePad(pad, bool) {
  bool = bool || 0;
  pad.addClass('active');
  switch ($(pad).attr('id')) {
    case 'green':
      activeSound = greenAudio();
      break;
    case 'red':
      activeSound = redAudio();
      break;
    case 'yellow':
      activeSound = yellowAudio();
      break;
    case 'blue':
      activeSound = blueAudio();
      break;
  }

  activeSound.start();
  if (bool) {
    setTimeout(deactivatePad, dur, pad);
  }
}

function deactivatePad(pad) {
  pad.removeClass('active');
  activeSound.stop();
}

function greenAudio() {
  var greenSound = audioCtx.createOscillator();
  greenSound.type = 'square';
  greenSound.frequency.value = 415;
  greenSound.connect(audioCtx.destination);
  return greenSound;
}

function redAudio() {
  var redSound = audioCtx.createOscillator();
  redSound.type = 'square';
  redSound.frequency.value = 310;
  redSound.connect(audioCtx.destination);
  return redSound;
}

function yellowAudio() {
  var yellowSound = audioCtx.createOscillator();
  yellowSound.type = 'square';
  yellowSound.frequency.value = 252;
  yellowSound.connect(audioCtx.destination);
  return yellowSound;
}

function blueAudio() {
  var blueSound = audioCtx.createOscillator();
  blueSound.type = 'square';
  blueSound.frequency.value = 209;
  blueSound.connect(audioCtx.destination);

  return blueSound;
}

function makeUnclickable(selector) {
  $(selector).removeClass('clickable');
  setTimeout(makeClickable, dur + 100, selector);
}

function makeClickable(selector) {
  $(selector).addClass('clickable');
}

function clearAllTimeouts(){
  for (var i = 0; i<timeouts.length; i++) {
  window.clearTimeout(timeouts[i]);
    $('.gamepad').removeClass('active');
}
}
