/**
* Little Cloud
* 
* Little Cloud is a WiFi controlled RGB lamp
* with Mp3 Player for baby sleep training
* 
* Davide Nastri, 9/18/2017
*/

var UI = require('ui');
var ajax = require('ajax');
var vibe = require('ui/vibe');

var splashScreen = new UI.Card({ banner: 'images/splash.png' });
splashScreen.show();

var mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Audio',
      subtitle: 'Change audio settings'
    }, {
      title: 'Light',
      subtitle: 'Change light settings'
    }, {
      title: 'All off',
      subtitle: 'Turn audio and light off'
    }]
  }]
});

var lightMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Red',
      subtitle: 'Sleep mode'
    }, {
      title: 'Green',
      subtitle: 'Awakening mode'
    }, {
      title: 'Blue',
      subtitle: 'Energizing mode'
    }, {
      title: 'White',
      subtitle: 'Normal light'
    }, {
      title: 'Off',
      subtitle: 'Light off'
    }]
  }]
});

var audioMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Play',
      subtitle: 'Play current song'
    },{
      title: 'Pause',
      subtitle: 'Pause current song'
    }, {
      title: 'Previous',
      subtitle: 'Play previous song'
    }, {
      title: 'Next',
      subtitle: 'Play next song'
    }, {
      title: 'Volume 100%',
      subtitle: 'Change volume to 100%'
    }, {
      title: 'Volume 90%',
      subtitle: 'Change volume to 90%'
    }, {
      title: 'Volume 80%',
      subtitle: 'Change volume to 80%'
    }, {
      title: 'Volume 70%',
      subtitle: 'Change volume to 70%'
    }, {
      title: 'Volume 60%',
      subtitle: 'Change volume to 60%'
    }, {
      title: 'Volume 50%',
      subtitle: 'Change volume to 50%'
    }]
  }]
});

mainMenu.on('select', function(e) {
  if (e.item.title=="Audio") {
    audioMenu.show();
  } else if (e.item.title=="Light") {
    lightMenu.show();
  } else if (e.item.title=="All off"){
    ajaxCall('dfMini','pause,100');
    ajaxCall('setColor','0,0,0,1000');
  }
});

audioMenu.on('select', function(e) {
  switch(e.item.title) {
    case "Play":
        ajaxCall('dfMini','play,100');
        break;
    case "Play All":
        ajaxCall('dfMini','playAll,100');
        break;
    case "Pause":
        ajaxCall('dfMini','pause,100');
        break;
    case "Previous":
        ajaxCall('dfMini','playPrevious,100');
        break;
    case "Next":
        ajaxCall('dfMini','playNext,100');
        break;
    case "Volume 100%":
        ajaxCall('dfMini','setVolume,28');
        break;
    case "Volume 90%":
        ajaxCall('dfMini','setVolume,25');
        break;
    case "Volume 80%":
        ajaxCall('dfMini','setVolume,22');
        break;
    case "Volume 70%":
        ajaxCall('dfMini','setVolume,19');
        break;
    case "Volume 60%":
        ajaxCall('dfMini','setVolume,16');
        break;
    case "Volume 50%":
        ajaxCall('dfMini','setVolume,13');
        break;
  }   
});

lightMenu.on('select', function(e) {
  switch(e.item.title) {
    case "Red":
        ajaxCall('setColor','255,0,0,1000');
        break;
    case "Green":
        ajaxCall('setColor','0,255,0,1000');
        break;
    case "Blue":
        ajaxCall('setColor','0,0,255,1000');
        break;
    case "White":
        ajaxCall('setColor','255,255,255,1000');
        break;
    case "Off":
        ajaxCall('setColor','0,0,0,1000');
        break;
  }   
});

function showMessage(title, subtitle, body) {
  var card = new UI.Card();
  card.title(title);
  card.subtitle(subtitle);
  card.body(body);
  card.show();
  setTimeout(function() {
  card.hide();
  }, 3000);
  
}

function ajaxCall(command, parameters) {
  vibe.vibrate('short');
  var token = 'YOUR_PARTICLE_TOKEN';
  var mydata = {access_token: token, args: parameters};

  ajax({
          url: 'https://api.particle.io/v1/devices/YOUR_PARTICLE_DEVICE_ID/' + command,
          method: 'post',
          data: mydata  
      },
      function(data) {
          data = JSON.parse(data);
          if (data.return_value==1) {
            vibe.vibrate('short');
            showMessage('Result', 'Request was successful', '');
          } else {
            vibe.vibrate('short');
            vibe.vibrate('short');
            vibe.vibrate('short');
            showMessage('Result', 'Request returned an error', data);
          }
      },
      function(error) {
          vibe.vibrate('short');
          vibe.vibrate('short');
          vibe.vibrate('short');
          showMessage('Result', 'Request returned an error', error);
      }
  );
}

setTimeout(function() {
  // Display the mainScreen
  mainMenu.show();
  // Hide the splashScreen to avoid showing it when the user press Back.
  splashScreen.hide();
}, 2500);
