let counter = 0

const module = [
    {
        question: "What is your name?",
        options: {
            invalid1: "His name is...",
            valid: "My name is...",
            invalid2: "Her name is..."
        },
        dialog: {
            true: "Nice to meet you",
            false: "¿¿??"
        },
        hint: {
            hint1: '"His" es en tercera persona',
            hint2: '"Her" es en tercera persona'
        }
    },
    {
        question: "Second question",
        options: {
            invalid1: "This is wrong",
            valid: "This is the correct",
            invalid2: "This is wrong"
        },
        dialog: {
            true: "Que bien lo has hecho!",
            false: "No estoy segura de entenderte"
        },
        hint: {
            hint1: 'Aquí reflexionamos de los errores',
            hint2: 'Aquí reflexionamos de los errores'
        }
    },
    {
        question: "Third question",
        options: {
            invalid1: "This is wrong",
            valid: "This is the correct",
            invalid2: "This is wrong"
        },
        dialog: {
            true: "Que bien lo has hecho!",
            false: "No estoy segura de entenderte"
        },
        hint: {
            hint1: 'Aquí reflexionamos de los errores',
            hint2: 'Aquí reflexionamos de los errores'
        }
    },
    {
        question: "Fourth question",
        options: {
            invalid1: "This is wrong",
            valid: "This is the correct",
            invalid2: "This is wrong"
        },
        dialog: {
            true: "Que bien lo has hecho!",
            false: "No estoy segura de entenderte"
        },
        hint: {
            hint1: 'Aquí reflexionamos de los errores',
            hint2: 'Aquí reflexionamos de los errores'
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
        displayLetterByLetter(dialogContainer, lesson.dialog.true, 100)
    } else {
        displayLetterByLetter(dialogContainer, lesson.dialog.false, 100)
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
            setProgress(validatedAnswer)
        })
    })
}

const answerValidation = (answer, lesson) => {
    switch (answer.toUpperCase()) {
        case lesson.options.invalid1.toUpperCase():
            return'invalid1'
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
        buttonCont.classList.add('d-none')
        showModal()
        changeOption(counter);
    })
}

window.addEventListener('load', () => {
    continueNext();
    selectedAnswer();
})

const showModal = () => {
    const continueContainer = document.querySelector('.continue-container')
    continueContainer.classList.toggle('show-modal')
}

//characters talk

const displayLetterByLetter = (destination, message, speed) => {
    let i = 0;
    let interval = setInterval(() => {
        destination.innerHTML += message.charAt(i);
        if (i % 2 == 0) {
            talk('.wrap-her');
        }
        i++;
        if (i > message.length) {
            closeMouth('.wrap-her')
            blink('.wrap-her')
            clearInterval(interval);
        }
    }, speed)
}

const talk = (person) => {
    const mouth = document.querySelector(`${person} .talk`)
    mouth.classList.toggle('open-mouth');
}

const closeMouth = (person) => {
    const mouth = document.querySelector(`${person} .talk`)
    mouth.classList.remove('open-mouth');
}

const blink = (person) => {
    const mouth = document.querySelector(`${person} .blink`)
    const interval = setInterval(() => {
        mouth.classList.toggle('close-eyes');
        clearInterval(interval)
    }, 250);
    mouth.classList.toggle('close-eyes');
}

// PROGRESSBAR

const progressBar = document.querySelector('.progressbar')
document.documentElement.style.setProperty('--progressbar-columns', module.length)

const setColumns = () => {
    const div = document.createElement('div')
    progressBar.appendChild(div)
    
    
}

( ()=> {
    for (let i = 0; i < module.length; i++) {
        setColumns()
    }
})()


const setProgress = (answerValue) => {
    const bar = [...document.querySelectorAll('.progressbar div')]
    if (answerValue.toUpperCase() == 'CORRECT') {
        bar[counter].classList.remove('bg-warning')
        bar[counter].classList.add('bg-success')
    } else {
        bar[counter].classList.toggle('bg-warning')
    }
}


