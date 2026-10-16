const taskForm=document.querySelector("#task-form");
const taskInput=document.querySelector("#task-input");
const taskList=document.querySelector("#task-list");
const emptyMessage=document.querySelector("#empty-message");
const taskCount=document.querySelector("#task-count");
const totalCount=document.querySelector("#total-count");
const filterButtons=document.querySelectorAll(".filter-button");
const clearCompletedButton=document.querySelector("#clear-completed");
const STORAGE_KEY="my-todo-tasks";
let tasks=loadTasks();
let currentFilter="all";

function loadTasks(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):[]}catch(error){return[]}}
function saveTasks(){localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks))}
function createTask(text){return{id:Date.now().toString()+Math.random().toString(16).slice(2),text,completed:false}}

function renderTasks(){
 const visibleTasks=tasks.filter(task=>currentFilter==="active"?!task.completed:currentFilter==="completed"?task.completed:true);
 taskList.innerHTML="";
 visibleTasks.forEach(task=>{
  const item=document.createElement("li");item.className="task-item"+(task.completed?" completed":"");item.dataset.id=task.id;
  const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.className="task-check";checkbox.checked=task.completed;checkbox.setAttribute("aria-label","Mark task as completed");checkbox.dataset.action="toggle";
  const text=document.createElement("span");text.className="task-text";text.textContent=task.text;
  const actions=document.createElement("div");actions.className="task-actions";
  const edit=document.createElement("button");edit.type="button";edit.className="action-button";edit.textContent="Edit";edit.dataset.action="edit";edit.setAttribute("aria-label","Edit task");
  const del=document.createElement("button");del.type="button";del.className="action-button delete";del.textContent="Delete";del.dataset.action="delete";del.setAttribute("aria-label","Delete task");
  actions.append(edit,del);item.append(checkbox,text,actions);taskList.appendChild(item);
 });
 const active=tasks.filter(task=>!task.completed).length;
 taskCount.textContent=`${active} ${active===1?"task":"tasks"} left`;totalCount.textContent=`${tasks.length} ${tasks.length===1?"task":"tasks"}`;
 emptyMessage.hidden=visibleTasks.length>0;taskList.hidden=visibleTasks.length===0;
 clearCompletedButton.disabled=!tasks.some(task=>task.completed);clearCompletedButton.style.opacity=clearCompletedButton.disabled?".45":"1";
}
taskForm.addEventListener("submit",event=>{event.preventDefault();const text=taskInput.value.trim();if(!text)return;tasks.unshift(createTask(text));saveTasks();renderTasks();taskForm.reset();taskInput.focus()});

// Delegated click listener handles Edit and Delete for all task rows.
taskList.addEventListener("click",event=>{
 const button=event.target.closest("button[data-action]");if(!button)return;
 const item=button.closest(".task-item");const task=tasks.find(entry=>entry.id===item.dataset.id);if(!task)return;
 if(button.dataset.action==="delete"){tasks=tasks.filter(entry=>entry.id!==task.id)}
 else if(button.dataset.action==="edit"){const updated=prompt("Edit your task:",task.text);if(updated===null)return;if(!updated.trim()){alert("Task cannot be empty.");return}task.text=updated.trim()}
 saveTasks();renderTasks();
});
taskList.addEventListener("change",event=>{
 if(!event.target.matches('input[data-action="toggle"]'))return;
 const item=event.target.closest(".task-item");const task=tasks.find(entry=>entry.id===item.dataset.id);if(!task)return;
 task.completed=event.target.checked;saveTasks();renderTasks();
});
filterButtons.forEach(button=>button.addEventListener("click",()=>{
 currentFilter=button.dataset.filter;
 filterButtons.forEach(filter=>{const selected=filter===button;filter.classList.toggle("active",selected);filter.setAttribute("aria-pressed",String(selected))});
 renderTasks();
}));
clearCompletedButton.addEventListener("click",()=>{tasks=tasks.filter(task=>!task.completed);saveTasks();renderTasks()});
renderTasks();
