const BASE_URL = "http://192.168.2.34:9090";

// Initialize counter
let counter = localStorage.getItem('counter1') || 0;
document.getElementById('counter').innerText = counter;

// Initialize color
let color = localStorage.getItem('color1') || '#00ff00';
document.getElementById('colorPicker').value = color;
document.getElementById('colorPicker').style.backgroundColor = color;
document.getElementById('titleInput').style.backgroundColor = color;
document.querySelector('.widget-container').style.backgroundColor = color;
document.querySelectorAll('.slot').forEach(slot => {
  slot.style.borderRight = `1px solid ${color}`;
});


// Initialize title
let title = localStorage.getItem('title1') || '';
document.getElementById('titleInput').value = title;
document.title = title;

// Generate slots for the progress bar
const initialNumSlots = localStorage.getItem('numSlots1') || 21;
document.getElementById('slotInput').value = initialNumSlots;
changeSlots();

// Fetch item details on load
window.onload = function () {
    if (itemId) {
        fetch(`${BASE_URL}/item/${itemId}`)
            .then(response => {
                if (!response.ok) {
                    // Item not found, create a new one
                    return createItem().then(() => fetchItem(itemId));
                }
                return response.json();
            })
            .then(data => {
                // Update UI with data
                counter = data.count;
                title = data.name;
                color = data.color;
                document.getElementById('counter').innerText = counter;
                document.getElementById('titleInput').value = title;
                document.getElementById('colorPicker').value = color;
                document.title = title;
            })
            .catch(error => console.error('Error:', error));
    }
};

function createItem() {
    // Define standard data for new item
    const newItem = {
        name: 'Counter',
        count: 0,
        color: '#00ff00'
    };

    return fetch(`${BASE_URL}/items/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    });
}

// Update progress bar based on counter
function updateProgressBar() {
  const slots = document.querySelectorAll('.slot');
  slots.forEach((slot, index) => {
    if (index < counter) {
      slot.style.backgroundColor = 'darkgreen';
      slot.style.borderRight = `1px solid ${color}`;
    } else {
      slot.style.backgroundColor = 'lightgreen';
      slot.style.borderRight = `1px solid ${color}`;
    }
  });
}

function changeSlots() {
  const numSlots = parseInt(document.getElementById('slotInput').value);
  const progressBar = document.querySelector('.progress-bar');
  progressBar.innerHTML = ''; // Clear existing slots

  for (let i = 0; i < numSlots; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    progressBar.appendChild(slot);
  }

  updateProgressBar();
  localStorage.setItem('numSlots1', numSlots); // Save the number of slots
}

function increment() {
    updateCount('add');
}

function decrement() {
    updateCount('subtract');
}

function updateCount(action) {
    fetch(`${BASE_URL}/itemsa/${itemId}/${action}`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            counter = data.count;
            document.getElementById('counter').innerText = counter;
            updateProgressBar();
        })
        .catch(error => console.error('Error:', error));
}

function changeTitle() {
    title = document.getElementById('titleInput').value;
    fetch(`${BASE_URL}/itemsn/${itemId}/${title}`, { method: 'PUT' })
        .then(response => {
            if (response.ok) {
                document.title = title;
            }
        })
        .catch(error => console.error('Error:', error));
}

function reset() {
  counter = 0;
  document.getElementById('counter').innerText = counter;
  localStorage.setItem('counter1', counter);
  updateProgressBar();
}

function changeColor() {
    color = document.getElementById('colorPicker').value;
    fetch(`${BASE_URL}/itemsc/${itemId}/${color}`, { method: 'PUT' })
        .then(response => {
            if (response.ok) {
                document.querySelector('.widget-container').style.backgroundColor = color;
                document.getElementById('colorPicker').style.backgroundColor = color;
                document.getElementById('titleInput').style.backgroundColor = color;
                document.querySelectorAll('.slot').forEach(slot => {
                    slot.style.borderRight = `1px solid ${color}`;
                });
            }
        })
        .catch(error => console.error('Error:', error));
}


