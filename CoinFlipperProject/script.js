function ChecksPositiveInteger(value, errorMessage) {
    if (!Number.isInteger(parseFloat(value)) || parseFloat(value) <= 0 ) {
        return errorMessage;
    } else {
        return "";
    }
}

function ChecksRange(value, min, max, errorMessage) {
    if (value < min || value > max) {
        return errorMessage;
    } else {
        return "";
    }
}

function ChecksIfNumber(value, errorMessage) {
    if (isNaN(value) || value.includes(" ")) {
        return errorMessage;
    } else {
        return "";
    }
}

function ChecksIfNull(value, errorMessage) {
    if (value === null || value === "") {
        return errorMessage;
    } else {
        return "";
    }
}

function PerformCoinFlip() {
    // Get input values
    var numCoins = document.getElementById("num1").value;
    var numThrows = document.getElementById("num2").value;

    console.log("numCoins:", numCoins);
    console.log("numThrows:", numThrows);

    // Accumulate error messages
    var errorMessages1 = "";
    var errorMessages2 = "";

    // Check positive integer
    errorMessages1 += ChecksPositiveInteger(numCoins, "'" + document.getElementById("num1").value+ "' is not a valid integer!") + "<br>";
    errorMessages2 += ChecksPositiveInteger(numThrows, "'" + document.getElementById("num2").value + "' is not a valid integer!") + "<br>";

    // Check range
    errorMessages1 += ChecksRange(numCoins, 1, 10, "Valid range is " + 1 + " to " + 10 + "!") + "<br>";
    errorMessages2 += ChecksRange(numThrows, 1, 10, "Valid range is " + 1 + " to " + 10 + "!") + "<br>";

    // Check if number
    errorMessages1 += ChecksIfNumber(numCoins, "'" + document.getElementById("num1").value + "' is not a number!") + "<br>";
    errorMessages2 += ChecksIfNumber(numThrows, "'" + document.getElementById("num2").value + "' is not a number!") + "<br>";

    // Check if null
    errorMessages1 += ChecksIfNull(numCoins, "No input!") + "<br>";
    errorMessages2 += ChecksIfNull(numThrows, "No input!") + "<br>";

    // Display accumulated error messages
    document.getElementById("num1Error").innerHTML = errorMessages1;
    document.getElementById("num2Error").innerHTML = errorMessages2;
    
    // If any input value is null, the result will only be "No input!"
    if (errorMessages1.includes("No input!")) {
        document.getElementById("num1Error").innerHTML = ("No input!");
    } else {
        // If any input value isn't within the range, the result will only be "Valid range is 1 to 10!"
        if (errorMessages1.includes("Valid range is 1 to 10!")) {
            document.getElementById("num1Error").innerHTML = ("Valid range is 1 to 10!");
        }
    }
    if (errorMessages2.includes("No input!")) {
        document.getElementById("num2Error").innerHTML = ("No input!");
    } else {
        if (errorMessages2.includes("Valid range is 1 to 10!")) {
            document.getElementById("num2Error").innerHTML = ("Valid range is 1 to 10!");
        } 
    }

    // If any input value isn't a number, the result will only be "input value is not a number!"
    if (errorMessages1.includes("'" + numCoins + "' is not a number!")) {
        document.getElementById("num1Error").innerHTML = ("'" + numCoins + "' is not a number!");
    }
    if (errorMessages2.includes("'" + numThrows + "' is not a number!")) {
        document.getElementById("num2Error").innerHTML = ("'" + numThrows + "' is not a number!");
    }

    // clear the paragraph's content after button is pressed
    document.getElementById("resultMessage").innerHTML = "";
}






