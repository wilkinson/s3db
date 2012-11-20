//- JavaScript source code

//- shownhidden.js ~~
//                                                  ~~ last updated 26 Oct 2012

function shownhidden(id) {
 // This function probably needs a `var` statement ...
    details = document.getElementById(id);
    if (details.className === 'shown') {
        details.className = 'hidden';
    } else {
        details.className = 'shown';
    }
    return;
}

//- vim:set syntax=javascript:
