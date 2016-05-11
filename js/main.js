/**
** Helper Functions
**/
const hasParent = (elm, parent) => elm === parent ? true : elm === document.body ? false : hasParent(elm.parentNode, parent);
/**
** Global Variables
**/
const mainNav = document.getElementById('main-nav');
const findFlights = document.getElementById('find-flights');
const toggleElmss = document.getElementsByClassName('toggle')
let toggleElms;
let toggleElmsModals;

/**
** All other
**/
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

var transitionEnd = whichTransitionEvent();

var transitionTimeout;

function addClassOnTransitionEnd(targetToggleElm, close) {
    let _this = this;
    clearTimeout(transitionTimeout);
    transitionTimeout = setTimeout(function() {
        _this.removeEventListener(transitionEnd, addClassOnTransitionEnd);
        if (!close) {
            targetToggleElm.classList.add('open');
        }
    }, 300);
}
window.addEventListener('click', (event) => {
    if (!toggleElms) {
        toggleElms = Array.from(toggleElmss);
        toggleElmsModals = toggleElms.map(elm => document.getElementById(elm.dataset.id));
    }
    var target = event.target;
    var targetToggleElm = toggleElmsModals[toggleElms.indexOf(target)];
    if (targetToggleElm) {
        event.preventDefault();
        event.stopPropagation();
        let close = targetToggleElm.classList.contains('open') ? true : false;
        var toggleElm = document.getElementById(target.dataset.id);
        var filtered = toggleElmsModals.filter(elm => elm.classList.contains('open'));
        filtered.forEach(elm => {
            elm.classList.remove('open');
            elm.addEventListener(transitionEnd, addClassOnTransitionEnd.bind(elm, targetToggleElm, close), false)
        });
        if (!close && !filtered.length) {
            targetToggleElm.classList.add('open');
        }
    }
});
