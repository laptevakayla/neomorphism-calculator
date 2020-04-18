;

'use strict';

let buttonsWhichCanBeActivated;
const canBeActivated = ['divide', 'multiply', 'subtract', 'add'];
let currentFunction;
let formula = '0';

/**
 * Checks number for error.
 */
function checkError(number) {
    if (!isFinite(number)) {
        return 'Error';
    }

    return number;
}

/**
 * Clears all.
 */
function clear() {
    currentFunction = null;
    display.innerHTML = '0';
    formula = '0';
}

/**
 * Clears current number.
 */
function clearCurrent() {
    display.innerHTML = '0';
    formula = formula.slice(0, formula.match(/[0-9]*\.?[0-9]*\)*$/).index) + '0' + formula.match(/\)*$/)[0];
}

function clickListener() {
    const datasetFunction = this.dataset.function;
    let sign;
    let valueToDisplay;

    buttonsWhichCanBeActivated.forEach(button => {
        button.classList.remove('button--active');
    });

    if (canBeActivated.includes(this.dataset.function) && !this.classList.contains('button--active')) {
        this.classList.add('button--active');
    }

    switch(datasetFunction) {
        case 'add':
        case 'subtract':
            if (datasetFunction === 'add') {
                sign = '+'
            } else {
                sign = '-'
            }

            if (currentFunction === datasetFunction) {
                display.innerHTML = toDisplay(formula);
                formula += sign;

                break;
            }

            if (currentFunction) {
                display.innerHTML = toDisplay(formula);
            }

            if (lastSign() !== sign) {
                formula += sign;
            }

            currentFunction = datasetFunction;

            break;
        case 'divide':
        case 'multiply':
            if (datasetFunction === 'divide') {
                sign = '/'
            } else {
                sign = '*'
            }

            if (currentFunction === datasetFunction) {
                display.innerHTML = toDisplay(formula.match(/[0-9]*\.?[0-9]*([*|/][0-9]*\.?[0-9]*)+$/)[0]);
                formula += sign;

                break;
            }

            if (currentFunction && currentFunction !== datasetFunction && currentFunction !== 'equal') {
                display.innerHTML = toDisplay(formula.match(/([0-9]*\.?[0-9]*([*|/][0-9]*\.?[0-9]*)+)|([0-9]*\.?[0-9]*)$/)[0]);
            }

            if (lastSign() !== sign) {
                formula += sign;
            }

            currentFunction = datasetFunction;

            break;
        case 'clear':
            clear();

            return;
        case 'clear-current':
            clearCurrent();

            this.innerHTML = 'AC';
            this.dataset.function = 'clear';

            return;
        case 'comma':
            if (lastSign() === ')') {
                formula += formula.match(/[+|\-|*|/].\)$/)[0][0];
            }

            if (lastSign() !== '.' && !isFinite(lastSign())) {
                display.innerHTML = '0,';
                formula += '0.';
            }

            if (!display.innerHTML.includes(',')) {
                display.innerHTML += ',';
                formula += '.';
            }

            break;
        case 'equal':
            if (formula.match(/^[0-9]*\.?[0-9]*?$/)) {
                break;
            }

            formula = '(' + formula;

            if (currentFunction === datasetFunction) {
                if (formula.match(/([+|\-|*|/]\(-[0-9]*\.?[0-9]*\)+$)|([+|\-|*|/][0-9]*\.?[0-9]*\)$)/)) {
                    formula += formula.match(/([+|\-|*|/]\(-[0-9]*\.?[0-9]*\)+$)|([+|\-|*|/][0-9]*\.?[0-9]*\)$)/)[0];
                } else if (formula.match(/[+|\-|*|/][0-9]*\.?[0-9]*\)?$/)) {
                    formula += formula.match(/[+|\-|*|/][0-9]*\.?[0-9]*\)?$/)[0] + ')';
                }
            } else {
                formula += ')';
            }

            display.innerHTML = toDisplay(formula);
            currentFunction = datasetFunction;

            break;
        case 'negation':
            valueToDisplay = String(formula.match(/\(?\-?[0-9]*\.?[0-9]*\)?$/)[0].replace('(', '').replace(')', '') * (-1));
            formula = formula.slice(0, formula.match(/\(?\-?[0-9]*\.?[0-9]*\)?$/).index) + (valueToDisplay >= 0 ? valueToDisplay : ('(' + valueToDisplay + ')'));
            display.innerHTML = toDisplay(valueToDisplay);

            break;
        case 'number':
            if (lastSign() !== '.' && !isFinite(lastSign())) {
                display.innerHTML = this.innerHTML;
                formula += this.innerHTML;

                break;
            }

            if (display.innerHTML === '0') {
                display.innerHTML = this.innerHTML;
                formula = this.innerHTML;
            } else {
                display.innerHTML += this.innerHTML;
                formula += this.innerHTML;
            }

            break;
        case 'percent':
            const lastMatch = formula.match(/[+|\-|*|/][0-9]*\.?[0-9]*$/);

            if (!lastMatch) {
                formula = '(' + formula + '/100' + ')';
                display.innerHTML = toDisplay(formula);

                break;
            }

            const lastMatchNumber = lastMatch[0].match(/[0-9]*\.?[0-9]*$/);

            valueToDisplay = lastMatchNumber[0] * formula.slice(0, lastMatch.index) / 100;
            display.innerHTML = toDisplay(valueToDisplay);
            formula = formula.slice(0, lastMatch.index + lastMatchNumber.index) + valueToDisplay;

            break;
    }

    const clearButton = get('.button[data-function="clear"]');

    if (clearButton) {
        clearButton.innerHTML = 'C';
        clearButton.dataset.function = 'clear-current';
    }
}

/**
 * Get element by selector.
 */
function get(selector) {
    return document.querySelector(selector);
}

/**
 * Get elements by selector.
 */
function getAll(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Selects last sign.
 */
function lastSign() {
    return formula[formula.length - 1];
}

/**
 * Fix JS 'wrong' calculations.
 */
function parseFloatToPrecision(number) {
    return parseFloat(number.toPrecision(12));
}

/**
 * Calculates and converts string to value for displaying.
 */
function toDisplay(string) {
    return toString(checkError(parseFloatToPrecision(eval(string))));
}

/**
 * Converts number to correct string.
 */
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

    getAll('.button').forEach(
        button => isMobileByAgent()
            ? button.addEventListener('touchend', clickListener)
            : button.addEventListener('click', clickListener),
    );
};
