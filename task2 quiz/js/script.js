document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const quizKey = urlParams.get('quiz');
    
    // If on the quiz page
    if (quizKey && quizzes[quizKey]) {
        quiz = quizzes[quizKey];
        document.getElementById('quiz-title').textContent = quiz.title;
        loadQuestion();

        // Attach the event listener for the Next button
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.addEventListener('click', nextQuestion);
        }
    } 
    
    // If on the leaderboard page
    else if (document.getElementById('score-display')) {
        const score = urlParams.get('score');
        const total = urlParams.get('total');
        
        if (score !== null && total !== null) {
            document.getElementById('score-display').textContent = `You scored ${score} out of ${total}`;
        } else {
            document.getElementById('score-display').textContent = 'Score not found!';
        }
    } 
});

let quiz, currentQuestionIndex = 0, score = 0, timer, timeLeft = 10;

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('time').textContent = timeLeft;
    const question = quiz.questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;

    const choicesList = document.getElementById('choices');
    choicesList.innerHTML = '';

    question.choices.forEach(choice => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', () => {
            if (!li.classList.contains('selected')) {
                selectAnswer(li);
                showResult(li);
                setTimeout(nextQuestion, 1500); // Delay to show the result
            }
        });
        choicesList.appendChild(li);
    });

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);

    // Enable the next button
    const nextButton = document.getElementById('next-button');
    nextButton.disabled = false;
}

function selectAnswer(selectedChoice) {
    const choices = document.querySelectorAll('#choices li');
    choices.forEach(choice => choice.classList.remove('selected'));
    selectedChoice.classList.add('selected');
}

function showResult(selectedChoice) {
    const question = quiz.questions[currentQuestionIndex];
    if (selectedChoice.textContent === question.answer) {
        selectedChoice.classList.add('correct');
        score++;
    } else {
        selectedChoice.classList.add('incorrect');
        const correctChoice = Array.from(document.querySelectorAll('#choices li'))
            .find(choice => choice.textContent === question.answer);
        correctChoice.classList.add('correct');
    }

    // Disable further selections
    const choices = document.querySelectorAll('#choices li');
    choices.forEach(choice => {
        choice.style.pointerEvents = 'none';
    });

    // Disable the next button until the next question is loaded
    const nextButton = document.getElementById('next-button');
    nextButton.disabled = true;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timer);
    window.location.href = `leaderboard.html?score=${score}&total=${quiz.questions.length}`;
}

// Example quiz data
const quizzes = {
    science: {
        title: "Science Quiz",
        questions: [
            {
                question: "What is the chemical symbol for water?",
                choices: ["H2O", "O2", "CO2", "H2"],
                answer: "H2O"
            },
            {
                question: "What planet is known as the Red Planet?",
                choices: ["Mars", "Jupiter", "Saturn", "Venus"],
                answer: "Mars"
            },
            {
                question: "What gas do plants absorb from the atmosphere?",
                choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                answer: "Carbon Dioxide"
            }
        ]
    },
    history: {
        title: "History Quiz",
        questions: [
            {
                question: "Who was the first president of the United States?",
                choices: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
                answer: "George Washington"
            },
            {
                question: "In what year did World War II end?",
                choices: ["1945", "1939", "1918", "1941"],
                answer: "1945"
            },
            {
                question: "Which ancient civilization built the pyramids?",
                choices: ["Roman", "Greek", "Egyptian", "Mayan"],
                answer: "Egyptian"
            }
        ]
    },
    math: {
        title: "Math Quiz",
        questions: [
            {
                question: "What is the square root of 64?",
                choices: ["6", "7", "8", "9"],
                answer: "8"
            },
            {
                question: "What is 5 multiplied by 6?",
                choices: ["28", "30", "32", "36"],
                answer: "30"
            },
            {
                question: "What is the value of Pi?",
                choices: ["3.12", "3.14", "3.16", "3.18"],
                answer: "3.14"
            }
        ]
    }
};