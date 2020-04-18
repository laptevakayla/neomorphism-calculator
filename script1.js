;

'use strict';

let buttonsWhichCanBeActivated;
const canBeActivated = ['divide', 'multiply', 'subtract', 'add'];
let canRunFunction = true;
let currentFunction;
let display;
let previousValue;
let switchDisplay = false;
let valueBeforeEqual;
let wasEqual = false;
let wasNumber = false;

function add() {
    display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(previousValue) + toNumber(valueBeforeEqual))));
    previousValue = display.innerHTML;
}

function checkError(number) {
    if (!isFinite(number)) {
        return 'Error';
    }

    return number;
}

function clear() {
    canRunFunction = true;
    currentFunction = null;
    display.innerHTML = '0';
    previousValue = null;
    switchDisplay = false;
    valueBeforeEqual = null;
    wasEqual = false;
    wasNumber = false;
}

function clearCurrent() {
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

function divide() {
    display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(previousValue) / toNumber(valueBeforeEqual))));
    previousValue = display.innerHTML;
}

function equal() {
    if (!valueBeforeEqual) {
        valueBeforeEqual = display.innerHTML;
    }

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

function multiply() {
    display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(previousValue) * toNumber(valueBeforeEqual))));
    previousValue = display.innerHTML;
}

function negation() {
    display.innerHTML = toString(checkError(toNumber(display.innerHTML) * (-1)));

    if (previousValue && wasEqual) {
        previousValue = toString(checkError(toNumber(previousValue) * (-1)));
    }
}

function parseFloatToPrecision(number) {
    return parseFloat(number.toPrecision(12));
}

function percent() {
    if (previousValue && !wasEqual) {
        display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(display.innerHTML) * toNumber(previousValue) / 100)));
    } else {
        display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(display.innerHTML) / 100)));
    }
}

function subtract() {
    display.innerHTML = toString(checkError(parseFloatToPrecision(toNumber(previousValue) - toNumber(valueBeforeEqual))));
    previousValue = display.innerHTML;
}

function toNumber(string) {
    return +string.replace(',', '.');
}

function toString(number) {
    return String(number).replace('.', ',');
}

window.onload = () => {
    buttonsWhichCanBeActivated = canBeActivated.reduce((res, name) => {
        const button = get(`.button[data-function="${ name }"]`);

        if (button) {
            res.push(button);
        }

        return res;
    }, []);
    display = get('.display');

    getAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            const datasetFunction = this.dataset.function;

            buttonsWhichCanBeActivated.forEach(button => {
                button.classList.remove('button--active');
            });

            if (canBeActivated.includes(this.dataset.function) && !this.classList.contains('button--active')) {
                this.classList.add('button--active');
            }

            switch(datasetFunction) {
                case 'clear':
                    clear();

                    return;

                case 'clear-current':
                    clearCurrent();

                    this.innerHTML = 'AC';
                    this.dataset.function = 'clear';

                    return;
                case 'comma':
                    comma();

                    break;
                case 'negation':
                    negation();

                    break;
                case 'percent':
                    percent();

                    break;
                case 'equal':
                    if ((currentFunction === datasetFunction) || (currentFunction !== datasetFunction && !wasEqual)) {
                        valueBeforeEqual = null;
                    }

                    equal();

                    wasEqual = true;
                    wasNumber = false;

                    break;
                case 'number':
                    canRunFunction = true;
                    switchDisplay = true;

                    if (wasEqual) {
                        previousValue = this.innerHTML;
                    }

                    if (switchDisplay && !wasNumber) {
                        display.innerHTML = this.innerHTML;
                        switchDisplay = false;
                        wasNumber = true;

                        break;
                    }

                    if (display.innerHTML === '0') {
                        display.innerHTML = this.innerHTML;
                    } else {
                        display.innerHTML += this.innerHTML;
                    }

                    wasNumber = true;

                    break;
                // case 'multiply':
                //     if (currentFunction === datasetFunction && !canRunFunction) {
                //         return;
                //     }
                //
                //     if (currentFunction === datasetFunction && !wasEqual) {
                //         valueBeforeEqual = null;
                //
                //         equal();
                //
                //         canRunFunction = false;
                //         switchDisplay = true;
                //         wasNumber = false;
                //
                //         break;
                //     } else if (currentFunction === datasetFunction && wasEqual) {
                //         wasEqual = false;
                //     } else if (canRunFunction && !wasEqual) {
                //         valueBeforeEqual = null;
                //
                //         equal();
                //     } else if (canRunFunction && wasEqual) {
                //         wasEqual = false;
                //     }
                //
                //     previousValue = display.innerHTML;
                //     canRunFunction = false;
                //     currentFunction = datasetFunction;
                //     switchDisplay = true;
                //     valueBeforeEqual = null;
                //     wasNumber = false;
                //
                //     break;
                default:
                    if (currentFunction === datasetFunction && !canRunFunction) {
                        return;
                    }

                    if (currentFunction === datasetFunction && !wasEqual) {
                        valueBeforeEqual = null;

                        equal();

                        canRunFunction = false;
                        switchDisplay = true;
                        wasNumber = false;

                        break;
                    } else if (currentFunction === datasetFunction && wasEqual) {
                        wasEqual = false;
                    } else if (canRunFunction && !wasEqual) {
                        valueBeforeEqual = null;

                        equal();
                    } else if (canRunFunction && wasEqual) {
                        wasEqual = false;
                    }

                    previousValue = display.innerHTML;
                    canRunFunction = false;
                    currentFunction = datasetFunction;
                    switchDisplay = true;
                    valueBeforeEqual = null;
                    wasNumber = false;

                    break;
            }

            const clearButton = get('.button[data-function="clear"]');

            if (clearButton) {
                clearButton.innerHTML = 'C';
                clearButton.dataset.function = 'clear-current';
            }
        });
    });
};
