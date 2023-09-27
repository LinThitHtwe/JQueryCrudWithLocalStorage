$(document).ready(function () {
  function generateUUID() {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
    return uuid;
  }

  $("#addForm").submit(function (event) {
    event.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const dob = $("#dob").val();
    const gender = $('input[name="gender"]:checked').val();

    const uuid = generateUUID();

    const newStudent = {
      id: uuid,
      name: name,
      email: email,
      dob: dob,
      gender: gender,
    };

    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];
    existingStudents.push(newStudent);
    localStorage.setItem("students", JSON.stringify(existingStudents));
    window.location.href = "home.html";
  });

  const studentData = JSON.parse(localStorage.getItem("students"));
  $("#studentTable").DataTable({
    data: studentData,
    columns: [
      { data: "name" },
      { data: "email" },
      {
        data: "dob",
        render: function (data) {
          if (data) {
            const date = new Date(data);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          }
          return "-";
        },
      },
      { data: "gender" },
      {
        data: "id",
        render: function (data, type, row) {
          return `<div class='form-group'>
                      <a href='updateStudent.html?data-id=${data}' class='btn btn-secondary'>Update</a>
                      <a href='#' data-id="${data}" data-name="${row.name}" class='btn btn-danger delete-btn'>Delete</a>
                  </div>`;
        },
      },
    ],
  });

  $(".delete-btn").click(function (event) {
    event.preventDefault();
    var deleteButton = $(this);
    $("#deleteStudentId").text(deleteButton.data("id"));
    $("#deleteStudentName").text(deleteButton.data("name"));
    $("#deleteConfirmModal").modal("show");
  });

  $("#deleteStudent").click(function (event) {
    event.preventDefault();
    const studentIdToDelete = $("#deleteStudentId").text();
    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];

    const indexToDelete = existingStudents.findIndex(
      (student) => student.id === studentIdToDelete
    );
    if (indexToDelete !== -1) {
      existingStudents.splice(indexToDelete, 1);
      localStorage.setItem("students", JSON.stringify(existingStudents));
    }
    location.reload();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const dataId = urlParams.get("data-id");
  console.log(dataId);

  const existingStudents = JSON.parse(localStorage.getItem("students")) || [];
  const studentToUpdate = existingStudents.find(
    (student) => student.id === dataId
  );

  if (studentToUpdate) {
    console.log("hi");
    $("#updateName").val(studentToUpdate.name);
    $("#updateEmail").val(studentToUpdate.email);
    $("#updateDob").val(studentToUpdate.dob);
    if (studentToUpdate.gender === "Male") {
      $("#updateMale").prop("checked", true);
    } else if (studentToUpdate.gender === "Female") {
      $("#updateFemale").prop("checked", true);
    }
  }

  $("#updateForm").submit(function (event) {
    event.preventDefault();

    const updatedName = $("#updateName").val();
    const updatedEmail = $("#updateEmail").val();
    const updatedDob = $("#updateDob").val();
    const updatedGender = $('input[name="gender"]:checked').val();
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get("data-id");
    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];

    const studentToUpdate = existingStudents.find(
      (student) => student.id === dataId
    );

    console.log(studentToUpdate);

    if (studentToUpdate) {
      studentToUpdate.name = updatedName;
      studentToUpdate.email = updatedEmail;
      studentToUpdate.dob = updatedDob;
      studentToUpdate.gender = updatedGender;

      console.log(existingStudents);
      localStorage.setItem("students", JSON.stringify(existingStudents));

      window.location.href = "home.html";
    }
  });
});
