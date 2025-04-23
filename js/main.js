// Phone number reveal functionality
const phoneNumber = '+61 410 791 105';

function revealPhone(event) {
    event.preventDefault();
    const phoneElement = document.getElementById('phoneNumber');
    
    if (phoneElement.textContent === 'Click to reveal phone number') {
        phoneElement.textContent = phoneNumber;
        phoneElement.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
    } else {
        phoneElement.textContent = 'Click to reveal phone number';
        phoneElement.href = '#';
    }
}