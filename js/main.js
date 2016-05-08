/**
** Helper Functions
**/
const hasParent = (elm, parent) => elm === parent ? true : elm === document.body ? false : hasParent(elm.parentNode, parent);
/**
** Global Variables
**/
const mainNav = document.getElementById('main-nav');
const findFlights = document.getElementById('find-flights');
const toggleElms = document.getElementsByClassName('toggle');

/**
** All other
**/
window.addEventListener('click', (event) => {
    var target = event.target;
    if ([].indexOf.call(toggleElms, target) !== -1) {
        event.preventDefault();
        event.stopPropagation();
        var toggleElm = document.getElementById(target.dataset.id);
        toggleElm.classList.contains('open') ? toggleElm.classList.remove('open') : toggleElm.classList.add('open');
    }
});
//{origin: "LTN", destination: "", date: "2016-05-08T11:21:07.352Z", numberOfSeats: 1}
// $.get('http://46.101.175.10/api/flights/CPH/2016-05-08T11:21:07.352Z/1').then(function(data) {
// 	console.log(data);
// })
// $.get('http://angularairline-plaul.rhcloud.com//api/flightinfo/CPH/2016-05-08T11:21:07.352Z/1').then(function(data) {
// 	console.log(data);
// })
// $.ajax({
//   type: "POST",
//   url: 'http://localhost:8080/SemesterProject/api/flight',
//   data: {origin: "LTN", destination: 'Hello', date: "2016-05-08T12:19:33.582Z", numberOfSeats: 1},
//   success: function(data) {
//       console.log('nuu')
//   },
//   dataType: 'json',
// });
// $.post('http://localhost:8080/SemesterProject/api/flight', ).then(function(data) {
// 	console.log(data);
// })
// http://angularairline-plaul.rhcloud.com/api
