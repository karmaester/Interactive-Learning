let counter = 0
let mistakes = 0
const module = [
    {
        question: "What is your name?",
        options: {
            invalid1: "His name is...",
            valid: "My name is...",
            invalid2: "Her name is..."
        },
        dialog: {
            her: "Hi! I'm Dani",
            him: "Hello! My name is Nicky!",
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
        setTimeout(() => {
            showModal()
        }, lesson.dialog.true.length * 100 + 150);
    }
}
let dialogContainer = document.querySelector('#dialog-container')
const displayDialog = (ans, lesson) => {
    dialogContainer.textContent = ''
    bubble.classList.remove('bubble-bottom-right')
    gender = '.wrap-her'
    if (ans == "correct") {
        displayLetterByLetter(dialogContainer, lesson.dialog.true, 100, gender)
    } else {
        displayLetterByLetter(dialogContainer, lesson.dialog.false, 100, gender)
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
let bubble = document.querySelector('.bubble')
const he_talks = (lesson) => {
    bubble.classList.add('bubble-bottom-right')
    gender = '.wrap-him'
    dialogContainer.textContent = ''
    displayLetterByLetter(dialogContainer, lesson.dialog.him, 100, gender)
}

const she_talks = (lesson) => {
    bubble.classList.remove('bubble-bottom-right')
    gender = '.wrap-her'
    dialogContainer.textContent = ''
    displayLetterByLetter(dialogContainer, lesson.dialog.her, 100, gender)
}

const answerValidation = (answer, lesson) => {
    switch (answer.toUpperCase()) {
        case lesson.options.invalid1.toUpperCase():
            mistakes += 1
            return 'invalid1'
        case lesson.options.invalid2.toUpperCase():
            mistakes += 1
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
        if (counter == module.length) {
            showModal()
            score_counter(mistakes)
            showModal_score()
        }
        else {
            console.log(counter + ',' + mistakes + '+' + module.length)
            showModal()
            changeOption(counter);
        }
    })
}

window.addEventListener('load', () => {
    continueNext();
    selectedAnswer();
    she_talks(module[counter])
    setTimeout(() => {
        he_talks(module[counter])
    }, 3000);
})

const showModal = () => {
    const continueContainer = document.querySelector('.continue-container')
    continueContainer.classList.toggle('show-modal')
}

const showModal_score = () => {
    const scoreContainer = document.querySelector('.score-container')
    scoreContainer.classList.toggle('show-modal')
}

const score_counter = (mistakes) => {
    let scoreContainer = document.querySelector('#score');
    scoreContainer.textContent = ''
    if (mistakes >= module.length / 2) {
        scoreContainer.classList.add('bg-warning')
        scoreContainer.textContent = 'You had ' + mistakes + ' mistakes, try again or go back to the lesson'
        // scoreContainer.appendChild(div)
    }
    else if (mistakes == 0) {
        scoreContainer.classList.add('bg-success')
        scoreContainer.textContent = 'You had ' + mistakes + ' mistakes, you can continue to the next lesson'
    }
    else if (mistakes == 1) {
        scoreContainer.classList.add('bg-success')
        scoreContainer.textContent = 'You had only ' + mistakes + ' mistake, you can continue to the next lesson'
    }
    else {
        scoreContainer.classList.add('bg-success')
        scoreContainer.textContent = 'You had only ' + mistakes + ' mistakes, you can continue to the next lesson'
    }
}

//characters talk

const displayLetterByLetter = (destination, message, speed, gender) => {
    let i = 0;
    let interval = setInterval(() => {
        destination.innerHTML += message.charAt(i);
        if (i % 2 == 0) {
            talk(gender);
        }
        i++;
        if (i > message.length) {
            closeMouth(gender)
            blink(gender)
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

(() => {
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


