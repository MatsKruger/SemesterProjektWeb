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
// window.addEventListener('click', (event) => {
//     if (!toggleElms) {
//         toggleElms = Array.from(toggleElmss);
//         toggleElmsModals = toggleElms.map(elm => document.getElementById(elm.dataset.id));
//     }
//     var target = event.target;
//     var targetToggleElm = toggleElmsModals[toggleElms.indexOf(target)];
//     if (targetToggleElm) {
//         event.preventDefault();
//         event.stopPropagation();
//         let close = targetToggleElm.classList.contains('open') ? true : false;
//         var toggleElm = document.getElementById(target.dataset.id);
//         var filtered = toggleElmsModals.filter(elm => elm.classList.contains('open'));
//         console.log('nuuu');
//         filtered.forEach(elm => {
//             elm.classList.remove('open');
//             elm.addEventListener(transitionEnd, addClassOnTransitionEnd.bind(elm, targetToggleElm, close), false)
//         });
//         if (!close && !filtered.length) {
//             targetToggleElm.classList.add('open');
//         }
//     }
// });

function autocomplete(id, scopeName, $scope, selectCallback) {
    id = '#' + id;
    var cached = {
        origin: null,
        destination: null
    };
    $(id).autocomplete({
        source: function(request, response) {
            $.getJSON(apiUrl + 'api/airport?q=' + request.term).then(response);
        },
        appendTo: $(id).closest('.group'),
        minLength: 2,
        select: function(event, ui) {
            if (ui.item) {
                $scope[scopeName] = ui.item;
                // this.value = ui.item.name + ', ' + ui.item.city + ' ' + ui.item.country;
            }
            $scope.$apply();
            this.blur();
            if (typeof selectCallback === "function")
                selectCallback();
            return false;
        },
        focus: function(event, ui) {
            return false;
        }
    })
    .keypress(function() {
        // console.log($scope.from);
    })
    .focus(function(){
        cached[scopeName] = Object.assign({}, $scope[scopeName]);
        // this.setSelectionRange(0, this.value.length)
        $(this).select().autocomplete("instance").search($(this).val());
    })
    .blur(function(){
        if ($scope[scopeName]) {
            if (cached[scopeName].iata === $scope[scopeName].iata) {
                $scope[scopeName] = cached[scopeName];
            }
            if (cached[scopeName] === $scope[scopeName]) {
                $scope.$apply();
                if ($scope[scopeName].name) {
                    // this.value = $scope[scopeName].name + ', ' + $scope[scopeName].city + ' ' + $scope[scopeName].country;
                }
            }
        }
        cached[scopeName] = null;
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $("<li>")
            .attr("data-value", item.iata)
            .append(item.name + ', ' + item.city + ' ' + item.country)
            .appendTo(ul);
    };
}
