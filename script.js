const mainContainer = document.getElementById("main__container");
const loadingContainer = document.getElementById("loading__container");

// built url to fetch from API opentdb.com quiz's api
function buildURL() {
  return `https://opentdb.com/api.php?amount=1&type=multiple`;
}

// built question form data that response form the api
function buildQuestion(question) {
  // object destructured
  const {
    question: questionText,
    correct_answer,
    incorrect_answers,
  } = question;

  document.getElementById("question").innerHTML = questionText;

  const choiceArray = randomQuestion(correct_answer, incorrect_answers);

  for (let i = 1; i <= choiceArray.length; i++) {
    document.getElementById(`choice_${i}`).value = choiceArray[i - 1];
    document.getElementById(`choice${i}`).innerHTML = choiceArray[i - 1];
  }
}

// function to generate the array that contain correct and incorrect answers
function randomQuestion(correctAnswer, incorrectAnswers) {
  const randomArray = [correctAnswer, ...incorrectAnswers];

  // shuffle the array to change the order of the element
  for (let i = randomArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
  }

  return randomArray;
}

// async function that deal with API's call
async function callingAPI(url) {
  mainContainer.style.display = "none";
  loadingContainer.style.display = "block";

  try {
    const response = await fetch(url);
    const data = await response.json();
    const questionObj = data.results[0];
    buildQuestion(questionObj);
    return questionObj.correct_answer;
  } catch (err) {
    console.error(err);
  } finally {
    mainContainer.style.display = "block";
    loadingContainer.style.display = "none";
  }
}
// async function that process api call function
async function processAPICall() {
  const form = document.getElementById("submitForm");
  const reqURL = buildURL();
  const correct_answer = await callingAPI(reqURL);
  // form submit event and check the answer comparing with correct and user selected answer
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedAnswer = document.querySelector(
      'input[name="choices"]:checked'
    );
    if (selectedAnswer) {
      const selectedValue = selectedAnswer.value;
      const correctAnswer = document.querySelector(
        'input[value="' + correct_answer + '"]'
      );
      if (selectedValue === correctAnswer.value) {
        document.getElementById("correct__alert").style.display =
          "inline-block";

        setTimeout(() => {
          clearDisplayAlert("c");
        }, 1000);
        form.reset();
        processAPICall();
      } else {
        document.getElementById("wrong__alert").style.display = "inline-block";
        setTimeout(() => {
          clearDisplayAlert("w");
        }, 1000);
        form.reset();
      }
    } else {
      alert("Please select an answer");
    }
  });
}

document.addEventListener("DOMContentLoaded", processAPICall());

// function that clear the alert
function clearDisplayAlert(status) {
  if (status === "c") {
    document.getElementById("correct__alert").style.display = "none";
  } else if (status === "w") {
    document.getElementById("wrong__alert").style.display = "none";
  }
}
