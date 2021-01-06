let submitBtn = document.querySelector('#submit');

const lesson1 = {
    question: "What's your name?",
    options: [
        "This is the first option",
        "Jose",
        "Martin"
    ],
    dialog: {
        true: "Nice to meet you",
        false: "Is that really your Name?"
    },
    hint: {
        hint1: 'Your name is not Jose.',
        hint2: 'Your name is not Martin.'
    }
}

// const selectedOption = async () => {
//     let selected = ''
//     let options = [...document.querySelectorAll('#option')];
//     options.forEach(opt => {
//         opt.addEventListener('click', e => {
//             selected = e.target.innerText
//         })
//     })
//     return selected
// }


const selectedAnswer = () => {
    let selected = ''
    let options = [...document.querySelectorAll('#option')];
    options.forEach(opt => {
        opt.addEventListener('click', e => {
            selected = e.target.innerText
            answerValidation(selected, lesson1)
        })
    })

}

selectedAnswer()

const answerValidation = (answer, lesson) => {
    if (answer == lesson.options[0]) {
        console.log('hello')
    } else if (answer == lesson.options[1]) {
        console.log('hello2')
    } else if (answer == lesson.options[2]) {
        console.log('hello3')
    } else {
        console.log('no')
    }

}

const changeQuestion = (question) => {
    let questionContainer = document.querySelector('#questionContainer');
    questionContainer.textContent = ''
    questionContainer.textContent = question
}

//display the possible answers
const changeOption = (newOptions) => {
    let options = [...document.querySelectorAll('#option')];
    options.forEach((el, idx) => {
        el.textContent = ''
        el.textContent = newOptions[idx]
    })
};

