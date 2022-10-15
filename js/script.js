window.addEventListener('DOMContentLoaded', () => {

     const tabs = require('./modules/tabs'),
           timer = require('./modules/timer'),
           slider = require('./modules/slider'),
           modal = require('./modules/modal'),
           forms = require('./modules/forms'),
           cards = require('./modules/cards'),
           calc = require('./modules/calc'); 

  tabs();
  timer();
  slider();
  modal();
  forms();
  cards();
  calc();
});




 