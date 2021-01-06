let submitBtn = document.querySelector('#submit');

const lesson1 = {
    question: "Where are you from?",
    options: {
        invalid1: "This is the incorrect option1",
        valid: "This is the correct option",
        invalid2: "This is the incorrect option2"
    },
    dialog: {
        true: "Nice to meet you",
        false: "Is that really your Name?"
    },
    hint: {
        hint1: 'Your name is not Jose.',
        hint2: 'Your name is not Martin.'
    }
}

const changeQuestion = (question) => {
    let questionContainer = document.querySelector('#questionContainer');
    questionContainer.textContent = ''
    questionContainer.textContent = question
}

//display the possible answers
const changeOption = () => {
    changeQuestion(lesson1.question)
    let options = [...document.querySelectorAll('#option')];
    let counter = 0
    for (let [key, value] of Object.entries(lesson1.options)) {
        options[counter].textContent = value
        counter += 1
    }
};

const displayHint = (ans) => {
    let hintContainer = document.querySelector('#hint-container')
    console.log(hintContainer)
    hintContainer.textContent = ''
    if (ans == "invalid1") {
        // hintContainer.classList.remove('hide');
        hintContainer.classList.remove("hide");
        hintContainer.textContent = lesson1.hint.hint1
    } if (ans == "invalid2") {
        hintContainer.classList.remove('hide');
        hintContainer.textContent = lesson1.hint.hint2
    } else {
        hintContainer.classList.add('hide');
    }
}

displayHint('invalid1')

const selectedAnswer = () => {
    changeOption()
    let selected = ''
    let options = [...document.querySelectorAll('#option')];
    options.forEach(opt => {
        opt.addEventListener('click', e => {
            selected = e.target.innerText
            answerValidation(selected, lesson1)
            // displayHint()
        })
    })
}

selectedAnswer()

const answerValidation = (answer, lesson) => {
    switch (answer.toUpperCase()) {
        case lesson.options.invalid1.toUpperCase():
            console.log('invalid1')
            break;
        case lesson.options.invalid2.toUpperCase():
            console.log('invalid2')
            break;
        case lesson.options.valid.toUpperCase():
            console.log('correct')
            break;
    }
}


