// Function to get the current day of the week
function getDayOfWeek() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    return daysOfWeek[today.getDay()];
  }
  
// Function to get the current time in 12-hour format
function getCurrentTime() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${ampm}`;
  }
  
  // Function to update the content based on the day and time
function updateMessage() {
    const dayOfWeek = getDayOfWeek();
    const today = new Date();
    const currentTime = today.getHours() * 100 + today.getMinutes();
    const messageSection = document.getElementById('message');
    const h2Element = messageSection.querySelector('h2');
    const pElement = messageSection.querySelector('p');
    const imgElement = messageSection.querySelector('img');
  
    // Declare variables within the function scope
    let mealName, mealImage;
  
    // Check if the kitchen is open or closed
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
      mealName = 'Eat Out or Look Out in your Fridge!';
      mealImage = 'https://as1.ftcdn.net/v2/jpg/04/17/20/74/1000_F_417207493_D51a2pllvBjqv33eMU8HVua1GvpnCvoG.jpg';
    } else if (currentTime >= 800 && currentTime < 1130) {
      mealName = 'Breakfast';
      mealImage = 'https://as1.ftcdn.net/v2/jpg/02/95/80/10/1000_F_295801031_Au80cKmxD1PklXa9DMrHY9UxjjuoZITZ.jpg';
    } else if (currentTime >= 1130 && currentTime < 1630) {
      mealName = 'Lunch';
      mealImage = 'https://www.shutterstock.com/image-photo/banner-vegan-lunch-bowls-isolated-260nw-2074493020.jpg';
    } else if (currentTime >= 1630 && currentTime < 2400) {
      mealName = 'Dinner';
      mealImage = 'https://www.realsimple.com/thmb/_z3j-dsOavcjB6eytMEqL9OnhBA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/family-dinner-recipes-4da078319d484078a386ca604f3c49ca.jpg';
    } else {
      mealName = 'Closed';
      mealImage = 'https://i.pinimg.com/736x/5e/e5/b8/5ee5b85fa75816d3f9a1f4e2f138a89c.jpg';
    }
  
    // Update the HTML content
    h2Element.textContent = mealName;
    pElement.textContent = dayOfWeek + ', ' + getCurrentTime(); // Use original getCurrentTime function
    imgElement.src = mealImage;
  }
  


// Additional function to test the code with specific date and time
function testCode(dayOfWeek, currentTime) {
    // Save the original Date class
    const OriginalDate = Date; //  to preserve the original behavior of the Date class before we override its methods for testing purposes.
  
    // Override the Date class for testing
    globalThis.Date = class extends OriginalDate {
      constructor() {
        super();
        this.getDay = () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeek);
        this.getHours = () => parseInt(currentTime.split(':')[0]);
        this.getMinutes = () => parseInt(currentTime.split(':')[1]);
      }
    };
  
    // Call the function to update the message
    updateMessage();
  
    // Restore the original Date class
    globalThis.Date = OriginalDate;
  }
  
    // Call the function on page load
    window.onload = function() {
    updateMessage();  // Call the updateMessage function on page load
  
    // Testing code
    // testCode('Saturday', '10:30'); // Test with Saturday at 10:30 AM
    // testCode('Monday', '9:00');   // Test with Monday at 12:00 PM
    // testCode('Wednesday', '24:00'); // Test with Wednesday at 6:45 PM

  };
  
