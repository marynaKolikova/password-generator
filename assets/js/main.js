'use strict';

const slideValue = document.querySelector(".number-length");
const inputSlider = document.getElementById("range");


const handleRangeColor = (e) => {
    const position = ((e.target.value - 4) * 100) / (e.target.max - 4);
    inputSlider.style.background = `linear-gradient(90deg, rgba(164,255,175,1) 0%, rgba(164,255,175,1) ${position}%, rgba(24,23,31,1) ${position}%)`;
}

inputSlider.addEventListener("input", (e) => {
    let value = inputSlider.value;
    slideValue.textContent = value;
    handleRangeColor(e);
});


// Object of all the function names that we will use to create random letter of passwords
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Random Secure Value
function secureMathRandom() {
    return (window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1));
}

// Generator Functions
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
    return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
    const symbol = '~!@#$%^&*()_+}{|":?><`-=[];/.,';
    return symbol[Math.floor(Math.random() * symbol.length)];
}

// The Box where the result will be shown
const resultEl = document.querySelector(".result-password");
// Checkboxes representing the option that is responsible to create different type of password
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("numbers");
const symbolEl = document.getElementById("symbols");
// Button to generate the password
const generateBtn = document.getElementById("button");
// Button to copy the password
const copyBtn = document.getElementById("c-btn");
const strengthLevel = document.getElementById("strength_level");
const levels = document.querySelectorAll(".level");
generateBtn.addEventListener("click", (event) => {
    event.preventDefault()
    let length = inputSlider.value;


    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;

    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    resultEl.style.opacity = 1;
});

// Functions to generate password and returning it
function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        for (let i = 0; i < length; i++) {
            generatedPassword += getRandomNumber();
        }
        strength(typesCount, length);
        return generatedPassword.slice(0, length);
    }

    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    strength(typesCount, length);
    return generatedPassword.slice(0, length);
}

// Event listener for the copy button
copyBtn.addEventListener("click", () => {
    // Copy the password to the clipboard
    const password = resultEl.innerText;

    if (password) {
        // Using the Clipboard API to copy the password to the clipboard
        navigator.clipboard.writeText(password)
            .then(() => {
                // Show the "Copied" message
                const resultInfo = document.querySelector(".result-info");

                // Make the result-info visible
                resultInfo.style.opacity = 1;

                // Optionally, you can change the text to "Copied"
                resultInfo.innerText = "Copied";

                // After 2 seconds, hide the message again
                setTimeout(() => {
                    resultInfo.style.opacity = 0;
                }, 2000);
            })
    }
});

function strength(typesCount, length) {
   if (typesCount === 2 && length <= 20) {
        strengthLevel.textContent = "Weak";
        levels[0].classList.add('weak');
        levels[1].classList.add('weak');
    } else if (typesCount === 3 && length <= 20) {
        strengthLevel.textContent = "Medium";
        levels[0].classList.add('medium');
        levels[1].classList.add('medium');
        levels[2].classList.add('medium');
    } else if (typesCount === 4 && length <= 20) {
        strengthLevel.textContent = "Strong";
        levels.forEach(level => level.classList.add("strong"));
    } else {
        strengthLevel.textContent = "Too Weak!";
        levels[0].classList.add("too-weak");
    }
}
