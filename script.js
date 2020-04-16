;

'use strict';

let currentFunction;
let currentValue = '0';
let display;
let startValue = '0';
let switchDisplay = false;

function add() {
    console.log(currentValue);
    console.log(currentFunction);

    display.innerHTML = toString(toNumber(display.innerHTML) + toNumber(currentValue));
}

function clear() {
    display.innerHTML = '0';
}

function comma() {
    if (switchDisplay) {
        display.innerHTML = '0,';
        switchDisplay = false;
    }

    if (!display.innerHTML.includes(',')) {
        display.innerHTML += ',';
    }
}

function equal() {
    // console.log();

    if (window[currentFunction]) {
        window[currentFunction]();
    }
}

function get(selector) {
    return document.querySelector(selector);
}

function getAll(selector) {
    return document.querySelectorAll(selector);
}

function negation() {

}

function percent() {

}

function toNumber(string) {
    return +string.replace(',', '.');
}

function toString(number) {
    return String(number).replace('.', ',');
}

window.onload = () => {
    display = get('.display');

    // console.log(getAll('.button'));

    getAll('.button').forEach(button => {
        button.addEventListener('click', function(a) {
            const datasetFunction = this.dataset.function;

            // console.log(a);
            // console.dir(this);
            console.log(this.dataset);

            switch(datasetFunction) {
                case 'number':
                    if (switchDisplay) {
                        display.innerHTML = this.innerHTML;
                        switchDisplay = false;

                        break;
                    }

                    if (display.innerHTML === '0') {
                        display.innerHTML = this.innerHTML;
                    } else {
                        display.innerHTML += this.innerHTML;
                    }

                    break;

                default:
                    currentFunction = this.dataset.function;

                    if (!switchDisplay) {
                        currentValue = display.innerHTML;
                        switchDisplay = true;
                    }

                    if (window[currentFunction]) {
                        window[currentFunction]();
                    }

                    break;
            }
        });
    });
};
