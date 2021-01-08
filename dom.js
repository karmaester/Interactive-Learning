let counter = 0

const module = [
    {
        question: "Where are you from?",
        options: {
            invalid1: "This is jaja the incorrect option1",
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
    },
    {
        question: "test2?",
        options: {
            invalid1: "This is the incorrect option1",
            valid: "This is the correct option",
            invalid2: "This is the incorrect option2"
        },
        dialog: {
            true: "test2 true dialog",
            false: "test2 false dialog"
        },
        hint: {
            hint1: 'Test2 hint 1',
            hint2: 'Test2 hint 2'
        }
    },
    {
        question: "test3?",
        options: {
            invalid1: "This is the incorrect option1",
            valid: "This is the correct option",
            invalid2: "This is the incorrect option2"
        },
        dialog: {
            true: "test3 true dialog",
            false: "test3 false dialog"
        },
        hint: {
            hint1: 'Test3 hint 1',
            hint2: 'Test3 hint 2'
        }
    }
]

const changeQuestion = (question) => {
    let questionContainer = document.querySelector('#questionContainer');
    questionContainer.textContent = ''
    questionContainer.textContent = question
}

//display the possible answers
const changeOption = (idx) => {
    changeQuestion(module[idx].question)
    let options = [...document.querySelectorAll('#option')];
    let counter = 0
    for (let [key, value] of Object.entries(module[idx].options)) {
        options[counter].textContent = value
        counter += 1
    }
};

const displayHint = (ans, lesson) => {
    let hintContainer = document.querySelector('#hint-container')
    hintContainer.textContent = ''
    if (ans == "invalid1") {
        hintContainer.classList.remove('hide');
        hintContainer.textContent = lesson.hint.hint1
    } else if (ans == "invalid2") {
        hintContainer.classList.remove('hide');
        hintContainer.textContent = lesson.hint.hint2
    } else {
        hintContainer.classList.add('hide');
        let buttonCont = document.querySelector('#continue')
        buttonCont.classList.remove('d-none')
        showModal()
    }
}

const displayDialog = (ans, lesson) => {
    let dialogContainer = document.querySelector('#dialog-container')
    dialogContainer.textContent = ''
    if (ans == "correct") {
        dialogContainer.textContent = lesson.dialog.true
    } else {
        dialogContainer.textContent = lesson.dialog.false
    }
}



const selectedAnswer = () => {
    changeOption(counter)
    let selected = ''
    let options = [...document.querySelectorAll('#option')];
    options.forEach(opt => {
        opt.addEventListener('click', e => {
            selected = e.target.innerText
            let validatedAnswer = answerValidation(selected, module[counter])
            displayDialog(validatedAnswer, module[counter])
            displayHint(validatedAnswer, module[counter])
        })
    })
}

selectedAnswer()

const answerValidation = (answer, lesson) => {
    switch (answer.toUpperCase()) {
        case lesson.options.invalid1.toUpperCase():
            return 'invalid1'
        case lesson.options.invalid2.toUpperCase():
            return 'invalid2'
        case lesson.options.valid.toUpperCase():
            return 'correct'
    }
}

const continueNext = () => {
    let buttonCont = document.querySelector('#continue')
    buttonCont.addEventListener('click', () => {
        counter += 1
        selectedAnswer()
        buttonCont.classList.add('d-none')
        showModal()
    })
}

continueNext()

const showModal = () => {
    const continueContainer = document.querySelector('.continue-container')
    continueContainer.classList.toggle('show-modal')
}