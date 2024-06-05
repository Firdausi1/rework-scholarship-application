import {
  AfricanCountries,
  countries,
  AsianCountries,
  SouthAmericanCountries,
  NorthAmericanCountries,
} from "./data.js";

const model = {
  firstTab: document.getElementById("firstTab"),
  secondTab: document.getElementById("secondTab"),
  thirdTab: document.getElementById("thirdTab"),
  addSubject: document.getElementById("addSubject"),
  appForm: document.getElementById("appForm"),
  gradeForm: document.getElementById("gradeForm"),
  gradeBtn: document.getElementById("gradeBtn"),
  container: document.getElementById("gradeContainer"),
  errorGrade: document.getElementById("errorGrade"),
  result: document.getElementById("result"),
  message: document.getElementById("message"),
  review: document.getElementById("review"),
  submitBtn: document.getElementById("submitBtn"),
  gradeBack: document.getElementById("gradeBack"),
  reviewBack: document.getElementById("reviewBack"),
  appContainer: document.getElementById("container"),
  rightContainer: document.getElementById("rightContainer"),
  application: document.getElementById("application"),
  complete1: document.getElementById("complete1"),
  complete2: document.getElementById("complete2"),
  complete3: document.getElementById("complete3"),
  step1: document.getElementById("step1"),
  step2: document.getElementById("step2"),
  step3: document.getElementById("step3"),
  totalScore: 0,
  grades: JSON.parse(localStorage.getItem("grades")) || [],
  showAdd: true,
  submit: true,
};
const view = {
  displayCountries: function () {
    let container = document.getElementById("country");
    let inner = countries
      .map((item) => {
        return `<option>${item}</option>`;
      })
      .join("");
    container.innerHTML += inner;
  },
  displayAllSubject: function () {
    let inner = model.grades
      .map((item, index) => {
        if (index === 1 || index === 0) {
          return `<div class="gridInput">
      <input type="text" class="otherSubject compulsory" placeholder="subject" value=${
        item.subject ? item.subject : ""
      } readonly >
      <input type="text" class="otherGrade" placeholder="grade" value=${
        item.grade ? item.grade : ""
      } >
    </div>`;
        }
        return `<div class="gridInput">
      <input type="text" class="otherSubject" placeholder="subject" value=${
        item.subject ? item.subject : ""
      } >
      <input type="text" class="otherGrade" placeholder="grade" value=${
        item.grade ? item.grade : ""
      } >
    </div>`;
      })
      .join("");
    model.container.innerHTML = inner;
  },
  displayAddSubject: function () {
    view.displayAllSubject();
    let container = document.getElementById("gradeContainer");
    container.innerHTML += `<div class="gridInput">
      <input type="text" class="otherSubject" placeholder="subject" />
      <input type="text" class="otherGrade" placeholder="grade" />
    </div>`;
    if (model.grades.length === 7) {
      model.addSubject.style.display = "none";
      model.gradeBtn.style.display = "block";
    }
  },
  displayReviewDetails: function () {
    const user = JSON.parse(localStorage.getItem("applicant"));
    const allgrades = JSON.parse(localStorage.getItem("grades"));
    document.getElementById("fullname").innerHTML =
      user.firstName + " " + user.lastName;
    document.getElementById("reviewAge").innerHTML = user.age;
    document.getElementById("reviewPhone").innerHTML = user.phone;
    document.getElementById("reviewGender").innerHTML = user.gender;
    document.getElementById("reviewSchool").innerHTML = user.school;
    document.getElementById("reviewCountry").innerHTML = user.country;

    const container = document.getElementById("bottom");
    const inner = allgrades
      .map((item, index) => {
        return `<div class="bottom-card" key=${index}><p class="subject">${item.subject}</p><p class="text">${item.grade}</p></div>`;
      })
      .join("");

    container.innerHTML = inner;
  },
};
const controller = {
  validateFields: function (error, user) {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{10,12}$/;
    const phone = user.phone.match(regex);
    if (user.firstName === "" || null) {
      error.errorFirstName.style.display = "inline-block";
      model.submit = false;
    } else if (user.lastName === "" || null) {
      error.errorLastName.style.display = "inline-block";
      model.submit = false;
    } else if (isNaN(user.age) || null) {
      error.errorAge.style.display = "inline-block";
      error.errorAge.innerHTML = "enter a valid number";
      model.submit = false;
    } else if (user.gender === "" || null) {
      error.errorGender.style.display = "inline-block";
      model.submit = false;
    } else if (user.phone === "") {
      error.errorPhone.style.display = "inline-block";
      model.submit = false;
    } else if (phone === null) {
      error.errorPhone.innerHTML =
        "phone pattern should match this format countrycode-number (234-9087678987)";
      error.errorPhone.style.display = "inline-block";
      model.submit = false;
    } else if (user.school === "" || null) {
      error.errorSchool.style.display = "inline-block";
      model.submit = false;
    } else if (user.country === "" || null) {
      error.errorCountry.style.display = "inline-block";
      model.submit = false;
    } else {
      model.submit = true;
    }
  },
  calculateUserScore: function (user) {
    if (user.age >= 18 && user.age <= 24) {
      model.totalScore += 100;
    } else if (user.age >= 25 && user.age <= 30) {
      model.totalScore += 80;
    } else if (user.age >= 31 && user.age <= 35) {
      model.totalScore += 50;
    } else if (user.age >= 36 && user.age <= 40) {
      model.totalScore += 30;
    } else if (user.age >= 41) {
      model.totalScore += 10;
    }
    const african = AfricanCountries.find((item) => item === user.country);
    const asian = AsianCountries.find((item) => item === user.country);
    const southAmerican = SouthAmericanCountries.find(
      (item) => item === user.country
    );
    const northAmerican = NorthAmericanCountries.find(
      (item) => item === user.country
    );
    if (african) {
      model.totalScore += 50;
    } else if (asian) {
      model.totalScore += 40;
    } else if (southAmerican) {
      model.totalScore += 30;
    } else if (northAmerican) {
      model.totalScore += 20;
    } else {
      model.totalScore += 10;
    }
  },
  save: function () {
    const allSubjects = document.querySelectorAll(".otherSubject");
    const allGrades = document.querySelectorAll(".otherGrade");
    let subName = "";
    let subjectInput = "";
    let gradeInput = "";

    allSubjects.forEach((item, index) => {
      subjectInput = "";
      if (item.value === "") {
        item.style.borderColor = "red";
        model.showAdd = false;
      } else {
        const incl = model.grades.find((item) => item.id === index);
        if (incl) {
          incl.subject = item.value;
          subjectInput = item.value;
          model.showAdd = true;
        } else {
          const exname = model.grades.find((val) => val.subject === item.value);
          if (exname && exname.subject === item.value) {
            subName = item.value;
            item.style.borderColor = "red";
            model.showAdd = false;
          } else {
            subjectInput = item.value;
            model.showAdd = true;
            model.grades.push({ subject: item.value.trim(), id: index });
          }
        }
      }
    });
    allGrades.forEach((item, index) => {
      gradeInput = "";
      if (item.value === "" || isNaN(item.value)) {
        item.style.borderColor = "red";
        model.showAdd = false;
      } else {
        const incl = model.grades.find((item) => item.id === index);
        if (incl) {
          incl.grade = parseInt(item.value);
          gradeInput = parseInt(item.value);
          model.showAdd = true;
        } else if (subName !== "" || subjectInput === "") {
          model.showAdd = false;
        } else {
          gradeInput = parseInt(item.value);
          model.grades.push({ grade: parseInt(item.value), id: index });
        }
      }
    });

    if (subName !== "") {
      model.errorGrade.innerHTML = "subject name already exists";
      model.errorGrade.style.display = "inline-block";
    } else if (subjectInput === "" && gradeInput === "") {
      model.errorGrade.innerHTML = "subject and grade field required";
      model.errorGrade.style.display = "inline-block";
    } else if (subjectInput === "") {
      model.errorGrade.innerHTML = "subject field required";
      model.errorGrade.style.display = "inline-block";
    } else if (isNaN(gradeInput) || gradeInput > 100 || gradeInput === "") {
      model.errorGrade.innerHTML = "enter valid grade";
      model.errorGrade.style.display = "inline-block";
    } else {
      model.errorGrade.style.display = "none";
    }
  },
  calculateTotal: function (grades) {
    let grade = grades.reduce((add, item) => add + item.grade, 0);
    grade = Math.floor(grade / grades.length);

    if (grade >= 90 && grade <= 100) {
      model.totalScore += 150;
    } else if (grade >= 85 && grade <= 89) {
      model.totalScore += 140;
    } else if (grade >= 75 && grade <= 84) {
      model.totalScore += 120;
    } else if (grade >= 65 && grade <= 74) {
      model.totalScore += 100;
    } else if (grade >= 60 && grade <= 64) {
      model.totalScore += 80;
    } else if (grade >= 50 && grade <= 59) {
      model.totalScore += 50;
    } else if (grade >= 40 && grade <= 49) {
      model.totalScore += 20;
    }
  },
  onSubmitDetails: function () {
    const error = {
      errorFirstName: document.getElementById("errorFirstName"),
      errorLastName: document.getElementById("errorLastName"),
      errorAge: document.getElementById("errorAge"),
      errorGender: document.getElementById("errorGender"),
      errorPhone: document.getElementById("errorPhone"),
      errorSchool: document.getElementById("errorSchool"),
      errorCountry: document.getElementById("errorCountry"),
    };

    error.errorFirstName.style.display = "none";
    error.errorLastName.style.display = "none";
    error.errorAge.style.display = "none";
    error.errorGender.style.display = "none";
    error.errorPhone.style.display = "none";
    error.errorSchool.style.display = "none";
    error.errorCountry.style.display = "none";

    const user = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      phone: document.getElementById("phone").value,
      school: document.getElementById("school").value.trim(),
      country: document.getElementById("country").value,
    };

    this.validateFields(error, user);

    if (model.submit) {
      localStorage.setItem("applicant", JSON.stringify(user));
      model.firstTab.classList.remove("active");
      model.secondTab.classList.add("active");
      model.appForm.style.display = "none";
      model.gradeForm.style.display = "block";
      model.complete1.style.display = "inline-block";
      model.complete1.classList.remove("completed");
      model.complete2.classList.add("completed");
      model.step1.classList.remove("active-step");
      model.step2.classList.add("active-step");
      this.calculateUserScore(user);
    }
  },
  handleAddSubject: function () {
    this.save();
    if (model.showAdd) {
      localStorage.setItem("grades", JSON.stringify(model.grades));
      view.displayAddSubject();
    }
  },
  onSubmitGrades: function () {
    this.save();

    if (model.showAdd) {
      localStorage.setItem("grades", JSON.stringify(model.grades));
      model.secondTab.classList.remove("active");
      model.thirdTab.classList.add("active");
      model.gradeForm.style.display = "none";
      model.review.style.display = "block";
      model.complete2.style.display = "inline-block";
      model.complete2.classList.remove("completed");
      model.step2.classList.remove("active-step");
      model.step3.classList.add("active-step");
      view.displayReviewDetails();
    }
  },
  onSubmitApplication: function () {
    model.submitBtn.style.cursor = "not-allowed";
    model.submitBtn.classList.add("disabled");
    model.appContainer.className = "container";
    model.rightContainer.style.display = "flex";
    model.reviewBack.style.display = "none";
    model.application.style.width = "80%";
    model.complete3.style.display = "inline-block";
    model.complete3.classList.add("completed");
    const applicant = JSON.parse(localStorage.getItem("applicant"));
    controller.calculateTotal(model.grades);

    if (model.totalScore >= 180) {
      model.message.innerHTML = `<p>Dear ${applicant.firstName} ${applicant.lastName}, <br><br>
  
      We are pleased to inform you that you have been selected as a recipient of the Scholarship. Your outstanding academic achievements and dedication have distinguished you among the many applicants.<br><br>
      
      As a scholarship recipient. We are confident that this support will help you continue to excel in your studies.
      <br><br>
      Congratulations on this well-deserved honor!
      <br><br>
      Best regards,
      <br>
      Scholarship Board <br><br>Total points gained: ${model.totalScore}</p>`;
    } else {
      model.message.innerHTML = `<p>Dear ${applicant.firstName} ${applicant.lastName}, <br><br> Thank you for your recent application for the Scholarship. After careful review, we regret to inform you that your application was not selected for this year's scholarship.
  <br><br>
      The selection process was highly competitive, and we received many outstanding applications. Unfortunately, we could only choose a limited number of recipients, and we were unable to include your application among them.
      <br><br>
      We encourage you to apply again in the future and wish you the best of luck in your academic and professional endeavors.
      <br><br>
      Sincerely,
      <br>
      Scholarship Board<br><br>Total points gained: ${model.totalScore}</p>`;
    }
  },
  handleReviewBack: function () {
    model.thirdTab.classList.remove("active");
    model.secondTab.classList.add("active");
    model.review.style.display = "none";
    model.gradeForm.style.display = "block";
    model.complete2.classList.add("completed");
    model.complete3.classList.remove("completed");
    model.step3.classList.remove("active-step");
    model.step2.classList.add("active-step");

    view.displayAllSubject();
  },
  handleGradeBack: function () {
    const user = JSON.parse(localStorage.getItem("applicant"));
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("gender").value = user.gender;
    document.getElementById("phone").value = user.phone;
    document.getElementById("school").value = user.school;
    document.getElementById("country").value = user.country;

    model.firstTab.classList.add("active");
    model.secondTab.classList.remove("active");
    model.appForm.style.display = "block";
    model.gradeForm.style.display = "none";
    model.complete1.classList.add("completed");
    model.complete2.classList.remove("completed");
    model.step2.classList.remove("active-step");
    model.step1.classList.add("active-step");
  },
};

document
  .getElementById("contBtn")
  .addEventListener("click", () => controller.onSubmitDetails());
model.addSubject.addEventListener("click", () => controller.handleAddSubject());
document.addEventListener("DOMContentLoaded", () => {
  view.displayCountries();
  model.gradeBtn.addEventListener("click", () => controller.onSubmitGrades());
});
model.submitBtn.addEventListener("click", () =>
  controller.onSubmitApplication()
);
model.reviewBack.addEventListener("click", () => controller.handleReviewBack());
model.gradeBack.addEventListener("click", () => controller.handleGradeBack());
window.onload = function reset() {
  localStorage.removeItem("applicant");
  localStorage.removeItem("grades");
};
