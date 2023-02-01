
//Dinara 
//Alisher

//! Project KPI
//! started CRUD
let API = "http://localhost:8000/kpi";

let inputName = $(".inp-name");
let inputPhone = $(".inp-phone");
let inputWeek = $(".inp-week-kpi");
let inputMonth = $(".inp-month-kpi");
let addForm = $(".add-form");

async function addStudent(event) {
  event.preventDefault();
  let nameVal = inputName.val().trim();
  let phoneVal = inputPhone.val().trim();
  let weekVal = inputWeek.val().trim();
  let monthVal = inputMonth.val().trim();
  let newStudent = {
    name: nameVal,
    phone: phoneVal,
    weekKpi: weekVal,
    monthKpi: monthVal,
  };
  console.log(newStudent);
  for (let key in newStudent) {
    if (!newStudent[key]) {
      alert("Заполните поля!");
      return;
    }
  }
  try {
    const response = await axios.post(API, newStudent);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  inputName.val("");
  inputPhone.val("");
  inputWeek.val("");
  inputMonth.val("");
}

addForm.on("submit", addStudent);

let studentsList = $(".tbody");
let students = [];

async function getStudents(URL) {
  try {
    const response = await axios(URL);
    // console.log(response);
    students = response.data;
    handlPagination();
  } catch (error) {
    console.log(error);
  }
}

//=============================================

// Dilmurat start

function kpi(students) {
  studentsList.html("");
  students.forEach((item, index) => {
    studentsList.append(`
    <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.phone}</td>
          <td>${item.weekKpi}</td>
          <td>${item.monthKpi}</td>
          <td>
          <button class="btn-delete" id="${item.id}">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2sUZ2H2ZrRnKyVwiS-4u1U6OtRHaX7b892rJwQPKMEMUjE3-VJHtuQk-ZMa3cW3-wFWA&usqp=CAU" class="trash">
          </button>
          </td>
          <td>
          <button id="${
            item.id
          }" class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <img src="https://www.pngall.com/wp-content/uploads/4/Update-Button-PNG-Picture.png" class="update">
          </button>
          </td>
          </tr>
        `);
  });
}
getStudents(API);


//! delete

async function deleteStudent(event) {
  let id = event.currentTarget.id;
  try {
    await axios.delete(`${API}/${id}`);
    getStudents(API);
    alert("Успешно удалено!");
  } catch (error) {
    console.log(error);
  }
}
$(document).on("click", ".btn-delete", deleteStudent);

//! Update
let editInpName = $(".edit-inp-name");
let editInpPhone = $(".edit-inp-phone");
let editInpWeekKpi = $(".edit-inp-week-kpi");
let editInpMonthKpi = $(".edit-inp-month-kpi");
let editForm = $(".edit-form");

async function getStudentToEdit(event) {
  let id = event.currentTarget.id;
  try {
    const response = await axios(`${API}/${id}`);
    editInpName.val(response.data.name);
    editInpPhone.val(response.data.phone);
    editInpWeekKpi.val(response.data.weekKpi);
    editInpMonthKpi.val(response.data.monthKpi);

    editForm.attr("id", id);
  } catch (error) {
    console.log(error);
  }
}
$(document).on("click", ".btn-edit", getStudentToEdit);

//! Update

async function saveEditedStudent(event) {
  event.preventDefault();
  let id = event.currentTarget.id;
  let editedStudent = {
    name: editInpName.val().trim(),
    phone: editInpPhone.val().trim(),
    weekKpi: editInpWeekKpi.val().trim(),
    monthKpi: editInpMonthKpi.val().trim(),
  };
  for (let key in editedStudent) {
    if (!editedStudent[key]) {
      alert("Заполните поля");
      return;
    }
  }
  try {
    await axios.patch(`${API}/${id}`, editedStudent);
    // alert("Изменеия сохранены");
    getStudents(API);
    $(".modal").modal("hide");
  } catch (error) {
    console.log(error);
  }
}
editForm.on("submit", saveEditedStudent);

// Dilmurat End


// Alibek start

// ! Pagination
let pagination = $(".pagination");
const studentsPerPage = 7;
let currentPage = 1;
let pagesCount = 1;
function handlPagination() {
  let indexOfLastStudent = currentPage * studentsPerPage;
  let indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  let currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  kpi(currentStudents);
  pagesCount = Math.ceil(students.length / studentsPerPage);
  // console.log(pagesCount);
  addPagination(pagesCount);
}

function addPagination(pagesCount) {
  pagination.html("");
  for (let i = 1; i <= pagesCount; i++) {
    pagination.append(`
     <li class="page-item ${
       currentPage === i ? "active" : ""
     }"><a class="page-link pagination-item" href="#">${i}</a></li>
    `);
  }
}

$(document).on("click", ".pagination-item", (event) => {
  let newPage = event.target.innerText;
  currentPage = +newPage;
  handlPagination();
});

// ! Search

let searchInp = $(".search-inp");
async function search(event) {
  let value = event.target.value;
  try {
    const response = await axios(`${API}?q=${value}`);
    students = response.data;
    currentPage = 1;
    handlPagination();
  } catch (error) {
    console.log(error);
  }
}
searchInp.on("input", search);
