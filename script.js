var btns = document.querySelectorAll('.btns button'),
    showChange = document.querySelector('.showChange'),
    penTaskFilter = document.querySelector('#penTaskFilter'),
    comTaskFilter = document.querySelector('#comTaskFilter'),
    pendingTodos = document.querySelector('.pendingTodos'),
    completeTodos = document.querySelector('.completeTodos'),
    todoList = document.querySelectorAll('.todoList'),
    addInputField = document.querySelector('.addInputField'),
    editInputField = document.querySelector('.editInputField'),
    addTaskBtn = document.querySelector('.addTask'),
    saveTaskBtn = document.querySelector('.saveTask'),
    pending = document.querySelector(".pending"),
    completeTasks = document.querySelector('.completeTask'),
    notification = document.querySelector('.notification'),
    deleteAllPenTodos = document.querySelector('.penTodos button'),
    deleteAllComTodos = document.querySelector('.comTodos button'),
    pendingNum = document.querySelector('.pendingNum'),
    completeNum = document.querySelector('.completeNum')
let editExsistingTask = "";
let comArr = [];
let listArr = [];

btns[0].addEventListener('click', () => {
    showChange.style.left = "0"
    btns[0].style.pointerEvents = "none"
    btns[1].style.pointerEvents = "auto"
    penTaskFilter.style.display = "block"
    comTaskFilter.style.display = "none"
    pendingTodos.style.display = "block"
    completeTodos.style.display = "none"
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
})

btns[1].addEventListener('click', () => {
    showChange.style.left = "50%"
    btns[0].style.pointerEvents = "auto"
    btns[1].style.pointerEvents = "none"
    penTaskFilter.style.display = "none"
    comTaskFilter.style.display = "block"
    pendingTodos.style.display = "none"
    completeTodos.style.display = "block"
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
})

addInputField.addEventListener('input', (event) => {
    var inputVal = addInputField.value;

    if (inputVal.trim() !== "") {
        addTaskBtn.classList.add('active');
        saveTaskBtn.style.cursor = "pointer";
    } else {
        addTaskBtn.classList.remove('active');
        saveTaskBtn.style.cursor = "not-allowed";
    }
});

function showNotification(message, type) {
    const popUp = document.createElement("div");
    popUp.id = "notification-popup";
    popUp.classList.add(type); // Add class for color (e.g., "success", "danger")

    const content = document.createElement("div");
    content.classList.add("popup-content");
    content.textContent = message;

    popUp.appendChild(content);
    document.body.appendChild(popUp);

    setTimeout(() => {
        document.body.removeChild(popUp);
    }, 1000);
}

showtask()

addInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(editExsistingTask);
    }
});

addTaskBtn.onclick = () => {
    addTask(editExsistingTask);
};

function addTask(editExsistingTaskUpdate) {
    let userData = addInputField.value.trim();

    if (!isValidInput(userData)) {
        showNotification("special charactors are not allowed", "danger");
        return;
    } else if (userData.length === 0) {
        showNotification("", "warning");
        return;
    }

    let pendingListArr = JSON.parse(localStorage.getItem('Pending Todos')) || [];
    let completeListArr = JSON.parse(localStorage.getItem('Complete Todos')) || [];

    let allTasksArr = [...pendingListArr, ...completeListArr]; // Combine both lists

    allTasksArr = allTasksArr.map(item => item.toLowerCase());

    if (pendingListArr.includes(editExsistingTaskUpdate)) {
        pendingListArr.splice(pendingListArr.indexOf(editExsistingTaskUpdate), 1);
        editExsistingTask = ""
    }

    if (!allTasksArr.includes(userData.toLowerCase())) {

        pendingListArr.unshift(userData);
        localStorage.setItem("Pending Todos", JSON.stringify(pendingListArr));
        showtask();

        addInputField.value = "";

        if (editExsistingTaskUpdate == "") {
            showNotification("ToDo is added Successfully", "success");
        } else {
            showNotification("ToDo is edited Successfully1", "success");
            addTaskBtn.style.display = "block";
            saveTaskBtn.style.display = "none";
            btns[0].click()
        }
        addTaskBtn.classList.remove("active");

        let newTaskElement = document.querySelector('.pending li'); //for scroll top
        if (newTaskElement) {
            newTaskElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        btns[0].click();

    } else {
        showNotification("Task already exists", "danger");
    }
}

function isValidInput(input) {
    const pattern = /^[a-zA-Z0-9 ]*$/;
    return pattern.test(input);
}

function showtask() {
    let getLocalStorage = localStorage.getItem("Pending Todos")
    if (getLocalStorage === null) {
        listArr = []

    }
    else {
        listArr = JSON.parse(getLocalStorage)
    }

    pendingNum.textContent = listArr.length

    if (listArr.length > 0) {
        deleteAllPenTodos.classList.add('active');
        deleteAllPenTodos.classList.remove('hidden');
    } else {
        deleteAllPenTodos.classList.remove('active');
        deleteAllPenTodos.classList.add('hidden');
    }

    let newTodos = ""

    listArr.forEach((element, index) => {
        newTodos += `<li>${element} <div class="action"><button onclick = "editTask(${index})"><i class="fa-solid fa-pen-to-square"></i></button><button onclick = "completeTask(${index})"><i class="fa-regular fa-square-check"></i></button><button onclick = "deleteTask(${index})"><i class="fa-solid fa-trash"></i></button></div></li>`
    })

    pending.innerHTML = newTodos
    addInputField.value = ""

    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
}

function deleteTask(index) {
    let getLocalStorage = localStorage.getItem("Pending Todos");
    let listArr = JSON.parse(getLocalStorage);
    const taskToDelete = listArr[index];
    showConfirm(`Are you want to delete?\n\n`, taskToDelete, function (result) {
        if (result) {
            listArr.splice(index, 1);
            localStorage.setItem("Pending Todos", JSON.stringify(listArr));
            showtask();
            showNotification("Task is Deleted Successfully", "danger");
        }
    });
}

function showConfirm(message, content, callback) {
    let confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-box");

    let messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerText = message;
    confirmBox.appendChild(messageBox);

    let popTaskBox = document.createElement("div");
    popTaskBox.classList.add("popTaskBox");
    popTaskBox.innerText = content;
    messageBox.appendChild(popTaskBox);

    let buttonBox = document.createElement("div");
    buttonBox.classList.add("button-box");
    messageBox.appendChild(buttonBox);

    let yesBox = document.createElement("button");
    yesBox.classList.add("yes-button");
    yesBox.textContent = "Yes";
    buttonBox.appendChild(yesBox);

    let noBox = document.createElement("button");
    noBox.classList.add("no-button");
    noBox.textContent = "No";
    buttonBox.appendChild(noBox);

    document.body.appendChild(confirmBox);
    function removeConfirmationBox() {
        document.body.removeChild(confirmBox);
    }

    yesBox.addEventListener("click", yesButtonClick);
    function yesButtonClick() {
        callback(true);
        removeConfirmationBox();
    }

    noBox.addEventListener("click", noButtonClick);
    function noButtonClick() {
        callback(false);
        removeConfirmationBox();
    }
}

deleteAllPenTodos.addEventListener('click', () => {

    showConfirm("Are you want to delete All Tasks?", (content = ""), function (result) {
        if (result) {
            listArr = []

            localStorage.setItem("Pending Todos", JSON.stringify(listArr))
            showtask()
            showNotification("Deleted All Pending Task", "danger")
        }
    });
})

function editTask(index) {
    let getLocalStorage = localStorage.getItem("Pending Todos");
    let listArr = JSON.parse(getLocalStorage);
    let currentTaskName = listArr[index];

    editExsistingTask = currentTaskName;
    editInputField.value = index;
    addInputField.value = currentTaskName;
    addTaskBtn.style.display = "none";
    saveTaskBtn.style.display = "block";
    addInputField.focus();

    saveTaskBtn.onclick = saveEditedTask;

    function saveEditedTask() {
        let editedValue = addInputField.value.trim().toLowerCase();
        let isValidInput = /^[a-zA-Z0-9]+$/.test(editedValue);

        if (isValidInput) {
            if (editedValue.length > 0) {
                let isDuplicate = listArr.map(item => item.toLowerCase()).includes(editedValue);

                if (!isDuplicate) {
                    listArr.splice(index, 1);
                    listArr.unshift(addInputField.value.trim());
                    localStorage.setItem("Pending Todos", JSON.stringify(listArr));
                    showtask();
                    addInputField.value = "";
                    addTaskBtn.style.display = "block";
                    saveTaskBtn.style.display = "none";

                    addTaskBtn.classList.remove("active");
                    showNotification("ToDo is Edited Successfully", "success");
                } else {
                    showNotification("This task already exists.", "danger");
                }
            } else {
                showNotification("Please enter a valid task", "danger");
            }
        } else {
            showNotification("Please avoid special characters.", "danger");
        }
    }
}

showCompleteTask()

function completeTask(index) {
    let getLocalStorage = localStorage.getItem("Pending Todos");
    let listArr = JSON.parse(getLocalStorage);
    const taskName = listArr[index];
    showConfirm(`Are you want to complete the task?\n\n`, taskName, function (result) {
        if (result) {
            let completedTask = listArr.splice(index, 1)[0];

            localStorage.setItem('Pending Todos', JSON.stringify(listArr));
            showtask();

            comArr.push(completedTask);
            localStorage.setItem("Complete Todos", JSON.stringify(comArr));
            showCompleteTask();
            showNotification("You have completed Task", "success");
        }
    });
}

function showCompleteTask() {
    let getLocalStorage = localStorage.getItem("Complete Todos")

    if (getLocalStorage == null) {
        comArr = []
    }
    else {
        comArr = JSON.parse(getLocalStorage)
    }

    completeNum.textContent = comArr.length

    if (comArr.length >= 1) {
        deleteAllComTodos.classList.add("active");
        deleteAllComTodos.style.display = "inline-block"; // Change 'visible' to 'inline-block' for correct display
    } else {
        deleteAllComTodos.classList.remove("active");
        deleteAllComTodos.style.display = "none";
    }

    let completeTask = ""

    comArr.forEach((element, index) => {
        completeTask += `<li>${element} <div class="action com"><button onclick = "back(${index})"><i class="fa-solid fa-xmark"></i></button><button onclick = "comDeleteTask(${index})"><i class="fa-solid fa-trash"></i></button></div></li>`
    })

    completeTasks.innerHTML = completeTask
}

function comDeleteTask(index) {
    let getLocalStorage = localStorage.getItem("Complete Todos");
    let comArr = JSON.parse(getLocalStorage);
    let taskName = comArr[index];
    showConfirm(`Are you want to delete task?\n\n`, taskName, function (result) {
        if (result) {
            comArr.splice(index, 1);
            localStorage.setItem("Complete Todos", JSON.stringify(comArr));
            showCompleteTask();
            showNotification("Deleted task from Completed Task", "danger");
        }
    });
}

deleteAllComTodos.addEventListener('click', () => {
    showConfirm("Are you want to delete All Tasks?", (content = ""), function (result) {

        if (result) {
            comArr = []

            localStorage.setItem("Complete Todos", JSON.stringify(comArr))
            showCompleteTask()
            showNotification("Deleted All Tasks from Completed List", "danger")
        }
    });

})

function back(index) {
    let getLocalStorageComplete = localStorage.getItem("Complete Todos");
    let comArr = JSON.parse(getLocalStorageComplete);
    let taskName = comArr[index];
    showConfirm(`Are you sure you want to move the task back?\n\n`, taskName, function (result) {
        if (result) {
            let backTodo = comArr.splice(index, 1);

            localStorage.setItem("Complete Todos", JSON.stringify(comArr));
            showCompleteTask();

            let getLocalStoragePending = localStorage.getItem("Pending Todos");
            let listArr = JSON.parse(getLocalStoragePending);

            listArr.unshift(backTodo[0]);

            localStorage.setItem("Pending Todos", JSON.stringify(listArr));
            showtask();
        }
    });
}

function filterPenTask() {
    let filterInput = document.querySelector('#penTaskFilter').value.toUpperCase()
    let li = pending.querySelectorAll('li')
    let matchFound = false;

    li.forEach(todo => {
        if (todo) {
            let textValue = todo.textContent || todo.innerHTML
            if (textValue.toUpperCase().indexOf(filterInput) > -1) {
                todo.style.display = "";
                matchFound = true;
            } else {
                todo.style.display = "none";
            }
        }
    });

    if (!matchFound) {
        showNotification("Match not found", "danger");
    }
}

function filterCompleteTask() {
    let filterInput = document.querySelector('#comTaskFilter').value.toUpperCase()
    let li = completeTasks.querySelectorAll('li')
    let matchFound = false;

    li.forEach(todo => {
        if (todo) {
            let textValue = todo.textContent || todo.innerHTML
            if (textValue.toUpperCase().indexOf(filterInput) > -1) {
                todo.style.display = "";
                matchFound = true;
            } else {
                todo.style.display = "none";
            }
        }
    });

    if (!matchFound) {
        showNotification("Match not found", "danger");
    }
}