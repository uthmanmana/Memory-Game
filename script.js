const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue;

// Items array
const items = [
  { name: "tree", image: "images/tree.png" },
  { name: "flower", image: "images/flower.png" },
  { name: "sun", image: "images/sun.png" },
  { name: "moon", image: "images/moon.png" },
  { name: "mountain", image: "images/mountain.png" },
  { name: "river", image: "images/river.png" },
  { name: "ocean", image: "images/ocean.png" },
  { name: "leaf", image: "images/leaf.png" },
  { name: "butterfly", image: "images/butterfly.png" },
  { name: "bird", image: "images/bird.png" },
  { name: "rainbow", image: "images/rainbow.png" },
  { name: "cloud", image: "images/cloud.png" },
];


// Initial Time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// For timer
const timeGenerator = () => {
  seconds += 1;
  // Minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (size = 4) => {
  // Temporary array
  let tempArray = [...items];
  // Initializes cardValues array
  let cardValues = [];
  // Size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  // Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // Once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        // Flip the clicked card
        card.classList.add("flipped");
        // If it is the first card (!firstCard since firstCard is initially false)
        if (!firstCard) {
          // So current card will become firstCard
          firstCard = card;
          // Current card's value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Increment moves since user selected second card
          movesCounter();
          // Second card and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // If both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Set firstCard to false since next card would be first now
            firstCard = false;
            // Win count increment as user found a correct match
            winCount += 1;
            // Check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            // If the cards don't match
            // Flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }

        // Check if all cards are flipped and matched
        if (document.querySelectorAll('.card-container.flipped').length === cards.length) {
          result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
          stopGame();
        }
      }
    });
  });
};

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // Controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // Start timer
  interval = setInterval(timeGenerator, 1000);
  // Initial moves
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
  initializer();
});

// Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
});

// Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

