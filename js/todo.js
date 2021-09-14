let userWorking =JSON.parse(localStorage.getItem("working")) 
let isLive = JSON.parse(sessionStorage.getItem("live"))
let arr = JSON.parse(localStorage.getItem("user")) || []
let userNow = arr.find(obj=>obj.account==userWorking);
let userTask = document.querySelectorAll('.form-control')
let index = 0
//pagination variable
const perTaskInPage = 4
let taskLength
let pageLength
let prev = document.querySelector('.prev')
let next = document.querySelector('.next')
let pagination 
let paginationItem
let currentPage=document.querySelector('.page-numbering .active').innerHTML
function UserTasks(name, description, deadline,status){
    this.name = name,
    this.description = description,
    this.deadline = deadline,
    this.status = status;
}
//check logged 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearForm(){
    for(let i = 0; i < userTask.length-1 ;i++){
        userTask[i].value = ''
    }
}
function updateUser(){
    for(let i = 0; i < arr.length ;i++){
        if(arr[i].account==userWorking){
            arr[i] = userNow
        }
    }
}
function submitInfor(){
    let newTask = new UserTasks(userTask[0].value,userTask[1].value,userTask[2].value,userTask[3].value)
    userNow.taskList.push(newTask)
    updateUser();
    localStorage.setItem("user" , JSON.stringify(arr))
    hideForm()
    showTask()
    showPagination()
}
function showformEdit(task){
    showform();
    let choosedTask = task.parentElement.parentElement.querySelectorAll('th,td')
    userTask[0].value = choosedTask[1].innerHTML
    userTask[1].value = choosedTask[2].innerHTML
    userTask[2].value = choosedTask[3].innerHTML
    userTask[3].value = choosedTask[4].innerHTML
    let submitButton = document.querySelector('form')
    submitButton.setAttribute('onsubmit','changeInfor()  ; return false')
    index = (choosedTask[0].innerHTML)-1
}

function changeInfor(){
    let editedTask = new UserTasks(userTask[0].value,userTask[1].value,userTask[2].value,userTask[3].value)
    userNow.taskList.splice(index,1,editedTask);
    updateUser();
    localStorage.setItem("user" , JSON.stringify(arr))
    hideForm()
    showTask()
}
function removeTask(task){
    let choosedTask = task.parentElement.parentElement.querySelectorAll('th,td')
    userNow.taskList.splice((choosedTask[0].innerText-1),1)
    updateUser()
    localStorage.setItem("user" , JSON.stringify(arr))
    showTask()
    showPagination();
}
async function checkLogged(){
    if(!isLive){
        showfailFormat("Vui lòng đăng nhập")
        await sleep(1000);
        window.location.replace("https://vanhocagc.github.io/todoListApp/login.html")
    }else{
        showSuccess(`Xin chào ${userWorking}`)
        document.querySelector('.user-infor').innerHTML =`<p>${userWorking}</p> <img src="./image/undraw_profile_pic_ic5t.svg" alt="user infor"><button onclick="showLogout()"><i class="fas fa-chevron-down"></i></button>`
    }
}

//logout
async function logout(){
    showSuccess(`Đăng xuất thành công`);
    sessionStorage.setItem('live', 'false')
    await sleep(1000);
    window.location.replace("https://vanhocagc.github.io/todoListApp/login.html")
}
//show
function showLogout(){
    let logoutButton = document.querySelector('.user-infor-box h5')
    if(logoutButton.style.display == 'none'){
        logoutButton.style.display = 'block'
    }else{
        logoutButton.style.display = 'none'
    }
}
function showSuccess(typeBox){
    let success = document.querySelector('.login-success')
    let successDivInner = document.querySelector('.login-success div')
    successDivInner.innerHTML = `<p>${typeBox} <i class="fas fa-check-circle"></i></p>`
    success.style.display = 'flex';
    setTimeout(function(){
      success.style.display = 'none';
      successDivInner.innerHTML = '';
    },2000)
}
function showfailFormat(content){
    let fail = document.querySelector('.login-fail')
    let failDivInner = document.querySelector('.login-fail div')
    failDivInner.innerHTML = `<p>${content} <i class="fas fa-exclamation-triangle"></i></p>`
    fail.style.display = 'flex';
    setTimeout(function(){
        fail.style.display = 'none';
        failDivInner.innerHTML = '';
    },2500)
}
function showform(){
    let formEl = document.querySelector('form');
    formEl.style.display = 'flex';
    formEl.setAttribute('onsubmit', 'submitInfor() ; return false')
}
function hideForm(){
    document.querySelector('form').style.display = 'none';
    clearForm();
}
function showTask(){
    let tableBody = document.querySelector('tbody')
    let content = ''
    let color
    let backgroundColor
    let chooseToCount = ((parseInt(currentPage))*4)>(userNow.taskList.length)?userNow.taskList.length:((parseInt(currentPage))*4)
    for (let i = (((parseInt(currentPage))-1)*4); i <chooseToCount ; i++){
        color = "#00cba9"
        backgroundColor = "#95ffed"
        if(userNow.taskList[i].status=== "Tạm dừng"){
            color = '#999'
            backgroundColor = "#e9e9e9"
        }else 
        if(((new Date(userNow.taskList[i].deadline).getTime())+86400000) <= new Date().getTime() && userNow.taskList[i].status=== "Đang làm"){
            color = '#ff384c'
            backgroundColor="#ffb9b9"
        }
        content +=(`<tr class="list-item" style="border-left: 2px solid ${color}; background-color: ${backgroundColor};">
        <th scope="row">${i+1}</th>
        <th colspan="2">${userNow.taskList[i].name}</th>
        <td colspan="2">${userNow.taskList[i].description}</td>
        <td class="deadline">${userNow.taskList[i].deadline}</td>
        <td class="status">${userNow.taskList[i].status}</td>
        <td class="edit">
            <div class="btn btn-warning px-5 py-2" onclick="showformEdit(this)">Sửa</div>
            <div class="btn btn-danger px-5 py-2" onclick="removeTask(this)">Xóa</div>
        </td></tr>`)
    }
    tableBody.innerHTML =content
}
showTask()

//pagination

function showPagination(){
    pagination = document.querySelector('.page-numbering')
    taskLength = userNow.taskList.length
    pageLength = Math.floor((taskLength-1)/perTaskInPage)+1
    let paginationContent = ''
    for (let i =0 ; i < pageLength ; i++){
        if(i==0){
            paginationContent+=`<div class="page active" onclick="beActive(this)">${i+1}</div>`
        }else{
            paginationContent+= `<div class="page" onclick="beActive(this)">${i+1}</div>`
        }
    }
    pagination.innerHTML = paginationContent
    paginationItem = document.querySelectorAll('.page-numbering div')
    currentPage = document.querySelector('.page-numbering .active').innerHTML
}
showPagination();
function nextPage(){
    for(let i = 0; i < paginationItem.length-1; i++){
        if(paginationItem[i].innerHTML == currentPage){
            removeActive()
            paginationItem[i+1].classList.add('active')
            currentPage = document.querySelector('.page-numbering .active').innerHTML
            break;
        }
    }
    showTask()
}
function prevPage(){
    for(let i = 1; i < paginationItem.length; i++){
        if(paginationItem[i].innerHTML == currentPage){
            removeActive()
            paginationItem[i-1].classList.add('active')
            currentPage = document.querySelector('.page-numbering .active').innerHTML
            break;
        }
    }
    showTask()
}
function beActive(page){
    removeActive()
    page.classList.add('active')
    currentPage = document.querySelector('.page-numbering .active').innerHTML
    showTask()
}
function removeActive(){
    for(let i = 0; i <paginationItem.length ; i++){
        paginationItem[i].classList.remove('active')
    }
}