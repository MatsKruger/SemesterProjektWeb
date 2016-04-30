/**
** Helper Functions
**/
const hasParent = (elm, parent) => elm === parent ? true : elm === document.body ? false : hasParent(elm.parentNode, parent);
/**
** Global Variables
**/
const mainNav = document.getElementById('main-nav');
const toggleElms = document.getElementsByClassName('toggle');


window.addEventListener('click', (event) => {
    let target = event.target;
    if ([].indexOf.call(toggleElms, target) !== -1) {
        event.preventDefault();
        switch(target.hash.substring(1)) {
            case 'main-nav':
                mainNav.classList.contains('open') ? mainNav.classList.remove('open') : mainNav.classList.add('open');
                break;
        }
    }
});
