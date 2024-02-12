function resultPage() {
    // Validate email
    var emailInput = document.getElementById('email');
    var emailValue = emailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        alert("Please enter a valid Gmail address.");
        return; // Exit the function if email is not valid
    }

    // Check each question individually
    var totalScore = 0;

    // Question 1
    var q1Answer = document.querySelector('input[name="q1"]:checked');
    if (q1Answer && q1Answer.value === "option4") {
        totalScore += 2;
    }

    // Question 2
    var q2Answer = document.querySelector('input[name="q2"]:checked');
    if (q2Answer && q2Answer.value === "option4") {
        totalScore += 2;
    }

    // Question 3
    var q3Answer = document.querySelector('input[name="q3"]:checked');
    if (q3Answer && q3Answer.value === "option2") {
        totalScore += 2;
    }

    // Question 4
    var q4Answer = document.querySelector('input[name="q4"]:checked');
    if (q4Answer && q4Answer.value === "option4") {
        totalScore += 2;
    }

    // Question 5
    var q5Answer = document.querySelector('input[name="q5"]:checked');
    if (q5Answer && q5Answer.value === "option3") {
        totalScore += 2;
    }
    
    var resultContent= "Your total score is: " + totalScore + " out of 10";
    // Display the result
    if (totalScore >= 5) {
    resultContent = "Congrats! " + resultContent;
    } else {
    resultContent = "Hard Luck! " + resultContent;
    }

    alert(resultContent);
}

function isValidEmail(email) {
    // Use a simple regex pattern to validate a Gmail address
    var gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

function clearAnswers() {
// Clear all selected answers
var radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(function (radioButton) {
    radioButton.checked = false;
});

// Clear the email input
document.getElementById('email').value = '';
}