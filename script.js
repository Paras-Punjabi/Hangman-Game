// DOM elements
let randomWordContainer = document.querySelector(".randomWord");
let keyboardContainer = document.querySelector(".keyboardContainer");
let hintContainer = document.querySelector(".hintContainer");
let hangmanContainer = document.querySelector(".hangman");
let hintBtn = document.querySelector(".hintBtn");
let livesDiv = document.querySelector(".livesDiv");
let getAnotherBtn = document.querySelector(".play");

let randomWord; // random word getting from API
let randomDefination; //  defination of that word getting from API
let numberLives = 10;
let DrawHangmanArrayCount = 0; // variable used in making Hangman animation
let correct = 0; // correct answers

// functions used in making Hangman --> 10 functions == 10 lives
// On each wrong click one function will be evoked according to flow of function array

function DrawFrame1() {
  // Bottom line
  hangmanContainer.innerHTML = "";
  let bottomLine = document.createElement("div");
  bottomLine.classList.add("bottomLine");
  hangmanContainer.appendChild(bottomLine);
}

function DrawFrame2() {
  // vertical line
  let verticalLine = document.createElement("div");
  verticalLine.classList.add("verticalLine");
  hangmanContainer.appendChild(verticalLine);
}

function DrawFrame3() {
  // top line
  let topLine = document.createElement("div");
  topLine.classList.add("topLine");
  hangmanContainer.appendChild(topLine);
}

function DrawFrame4() {
  // small piece of rope to hang the man
  let smallLine = document.createElement("div");
  smallLine.classList.add("smallLine");
  hangmanContainer.appendChild(smallLine);
}

function DrawHead() {
  // his head
  let head = document.createElement("div");
  head.classList.add("head");
  hangmanContainer.appendChild(head);
  let nose = document.createElement("div");
  nose.classList.add("nose");
  head.appendChild(nose);
  let smile = document.createElement("div");
  smile.classList.add("smile");
  head.appendChild(smile);
}

function DrawBody() {
  // his body
  let body = document.createElement("div");
  body.classList.add("hangmanBody");
  hangmanContainer.appendChild(body);
}

function DrawLeftHand() {
  // hands
  let leftHand = document.createElement("div");
  leftHand.classList.add("hand", "leftHand");
  hangmanContainer.appendChild(leftHand);
}

function DrawRightHand() {
  //hands
  let rightHand = document.createElement("div");
  rightHand.classList.add("hand", "rightHand");
  hangmanContainer.appendChild(rightHand);
}

function DrawLeftLeg() {
  // legs
  let leftLeg = document.createElement("div");
  leftLeg.classList.add("legs", "leftLeg");
  hangmanContainer.appendChild(leftLeg);
}

function DrawRightLeg() {
  // legs
  let rightLeg = document.createElement("div");
  rightLeg.classList.add("legs", "rightLeg");
  hangmanContainer.appendChild(rightLeg);
  let span = document.createElement("span");
  span.innerHTML = "Man Hanged💀💀";
  span.classList.add("text");
  hangmanContainer.appendChild(span);
}

// Function array of making of Hangman
let drawHangmanArray = [
  DrawFrame1,
  DrawFrame2,
  DrawFrame3,
  DrawFrame4,
  DrawHead,
  DrawBody,
  DrawLeftHand,
  DrawRightHand,
  DrawLeftLeg,
  DrawRightLeg,
];

// number of lives left when wrong letter is clicked
livesDiv.innerHTML = `You have ${numberLives} lives`;

// Random Word Api call
function GenerateRandomWord() {
  randomWordContainer.innerHTML = "";
  let url = "https://random-words-api.vercel.app/word";
  fetch(url)
    .then((req) => {
      return req.json();
    })
    .then((data) => {
      randomWord = data[0].word.toUpperCase();

      // defination or hint to guess the word
      randomDefination = data[0].definition;
      hintBtn.addEventListener(
        "click",
        (GetDefination = () => {
          hintContainer.innerHTML = `Defination : ${randomDefination}`;
          hintBtn.removeEventListener("click", GetDefination);
        })
      );

      // number of spaces is equal to length of word
      for (let i = 0; i < data[0].word.length; i++) {
        let space = document.createElement("div");
        space.classList.add("space");
        randomWordContainer.appendChild(space);
      }
    });
}

// KeyBoard Geaneration
function generateKeyBoard() {
  for (let i = 65; i < 91; i++) {
    let btn = document.createElement("div");
    btn.classList.add("key");
    btn.innerHTML = String.fromCharCode(i);
    keyboardContainer.appendChild(btn);

    // click event of a key(letter)
    btn.addEventListener(
      "click",
      (ClickBtn = () => {
        checkGuesses(randomWord, btn.innerText); // to check the letter clicked is contained in word or not
        btn.style.visibility = "hidden";
      })
    );
  }
}

GenerateRandomWord();
generateKeyBoard();

// reset the game when clicked on get another button
getAnotherBtn.addEventListener(
  "click",
  (ResetPlay = () => {
    GenerateRandomWord();
    keyboardContainer.innerHTML = "";
    generateKeyBoard();
    hangmanContainer.innerHTML = "🕴Hangman Formation🕴";
    numberLives = 10;
    livesDiv.innerHTML = `You have ${numberLives} lives`;
    DrawHangmanArrayCount = 0;
    hintContainer.innerHTML = "Get Defination here🤔";
  })
);

//------------------------------------------------------
// Main Function or Logic*****
function checkGuesses(word, letter) {
  if (word.includes(letter)) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] == letter) {
        correct++; // maximum value of correct is  equal to length of word
        let spaces = document.querySelectorAll(".space");

        // apending the correct letter above the space
        let l = document.createElement("div");
        l.innerHTML = letter;
        l.classList.add("letterGuess");
        spaces[i].appendChild(l);

        // code when all the spaces are filled or Congratulating the user as he/she win's the game
        if (correct == randomWord.length) {
          hangmanContainer.innerHTML = "";
          drawHangmanArray.forEach((func) => {
            func();
          });
          hangmanContainer.querySelector('span').innerText = "Man Gets Saved😊😊";
          hangmanContainer.querySelectorAll('.legs').forEach(leg=>leg.style.top = "135px")
          hangmanContainer.querySelectorAll('.hand').forEach(item=>item.style.top = "68px")
          hangmanContainer.querySelector('.head').style.top = "47px"
          hangmanContainer.querySelector('.hangmanBody').style.top = "87px"
          hangmanContainer.querySelector('.leftHand').style.transform = "rotate(-60deg)"
          hangmanContainer.querySelector('.rightHand').style.transform = "rotate(60deg)"
          
          setTimeout(() => {
            let textWon = ` Winner!!😎😎
            <br>
            Congratulations🥳👏👏
            <br>
            Lives Left : ${numberLives}
            <br>
            Correct Answer : ${randomWord}
            <br>
            Defination : ${randomDefination}`;
            createModal(textWon);
          }, 1000);
        }
      }
    }
  } else {
    // Game over
    if (numberLives == 1) {
      setTimeout(() => {
        let textLoss = `  You Lost 💩💩
        <br>
        Correct Answer : ${randomWord}
        <br>
        Defination : ${randomDefination}`;
        createModal(textLoss);
      }, 800);
    }

    // when wrong letter is clicked lives will be reduced by 1
    numberLives--;
    livesDiv.innerHTML = `You have ${numberLives} lives`;

    // drawing hangman from function array
    drawHangmanArray[DrawHangmanArrayCount]();
    DrawHangmanArrayCount++;
  }
}

//-----------------------------------

// creating modal for winning or lossing the game using "Bootstrap5"
function createModal(text) {
  let modal = document.createElement("div");
  modal.innerHTML = `<!-- Button trigger modal -->
  <button type="button" class="btn btn-primary" id="gameBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    Launch static backdrop modal
  </button>
  
  <!-- Modal -->
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div style="text-align:center;" class="modal-body  fs-1">
         ${text}
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary mx-auto" onclick="window.location.reload()" data-dismiss="modal">Play Again</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.appendChild(modal);

  // click event to launch the modal without using user interference
  let btn = document.getElementById("gameBtn");
  btn.click();
  btn.style.display = "none";
}
