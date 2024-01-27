const form = document.querySelector("#task-form");
const todoList = document.querySelector("#todolane");
const doing = document.querySelector("#doinglane")
const tasks = document.querySelectorAll(".task");
const taskLanes = document.querySelectorAll(".tasklane");
const saveBtn = document.querySelector('#save');

let todoItems=[];
let doneItems=[];
let doingItems=[];

let source=null;
let target=null;

const stored = JSON.parse(localStorage.getItem('tasks'));
console.log(stored);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //task.length===task.length>0

  const task = event.target[0].value;

  if (task.length && task.length <= 30) {

    const div = document.createElement("div");
    const para = document.createElement("p");

    para.innerText = task;
    div.className="task";
    div.setAttribute("draggable", "true");
    
    div.addEventListener("dragstart", (e) => {
      div.classList.add("is-dragging");
      para.setAttribute("contenteditable", "false");
      source = e.target.parentNode.id;
    });
    div.addEventListener("dragend", (e) => {
      div.classList.remove("is-dragging");
      para.setAttribute("contenteditable", "false");
      target = e.target.parentNode.id;
      recalculateTasksArr(task);
    });

    todoItems.push(task);

    div.appendChild(para);
    todoList.appendChild(div);

    const delContainer = document.createElement("div");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    editButton.innerHTML = '<i class="fa fa-edit"></i>';

    deleteButton.classList.add("deleteTask");
    editButton.classList.add("editTask");
    
    delContainer.appendChild(editButton);
    delContainer.appendChild(deleteButton);
    
    div.appendChild(deleteButton);
    div.appendChild(editButton);

    event.target[0].value = "";
     
    deleteButton.addEventListener('click', function (e) {
      let target = e.target;
      if (target.matches('button')) {
          target.parentElement.remove();
      }
      if (target.matches('i')) {
          target.parentElement.parentElement.remove();
      }
    });

    editButton.addEventListener('click',()=>{
      
      para.setAttribute("contenteditable", "true");
      let sel = window.getSelection();
      sel.selectAllChildren(para);
      sel.collapseToEnd();

      //const wbody = document.querySelector('task-wrapper');
      wbody.addEventListener('click',()=>{
        const wbody = document.querySelector('task-wrapper');
        //para.removeAttribute(contenteditable);
        //
      })

      //setEndOfContenteditable(para);
    })


   } else {
    alert("Your Task is either empty or it exceeds the 30 character limit");
  }
});

taskLanes.forEach(phase=> {
  phase.addEventListener("dragover",(e)=>{
    e.preventDefault();
    const currtask=document.querySelector('.is-dragging');
    const sibling = nextClosestSibling(phase, e.clientY);
    if(!sibling){
      phase.appendChild(currtask);
    }
    else{
      phase.insertBefore(currtask,sibling)
    }
  })
})

saveBtn.addEventListener('click', () => {
  const tasks = JSON.stringify({
      todo: todoItems,
      doing: doingItems,
      done: doneItems
  });
  localStorage.setItem('tasks', tasks);
  alert('Sucessfully saved')
});

function recalculateTasksArr(task) {
  console.log(source,target,task);
  let sourceArr = [];
  let targetArr = [];

  if (source === "todo-lane") {
      sourceArr = [...todoItems];
  } else if (source === "doing-lane") {
      sourceArr = [...doingItems]
  } else {
      sourceArr = [...doneItems];
  }

  if (target === "todo-lane") {
      targetArr = [...todoItems];
  } else if (target === "doing-lane") {
      targetArr = [...doingItems]
  } else {
      targetArr = [...doneItems];
  }

  const taskIndex = sourceArr.findIndex((el) => el === task);
  sourceArr.splice(taskIndex,1);
  targetArr.push(task);

  if (source === "todo-lane") {
      todoItems = sourceArr;
  } else if (source === "doing-lane") {
      doingItems = sourceArr
  } else {
      doneItems = sourceArr;
  }

  if (target === "todo-lane") {
      todoItems = targetArr;
  } else if (target === "doing-lane") {
      doingItems = targetArr
  } else {
      doneItems = targetArr;
  }

  //console.log(todoItems, doingItems, doneItems)
}

function nextClosestSibling(phase, mouseY) {
  const els = phase.querySelectorAll(".task:not(.is-dragging)");
  let closestTask = null;
  let closestOffset = -10000000000;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });
  return closestTask;
}