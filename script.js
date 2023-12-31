// Add Student Form
document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var student = {
        name: document.getElementById('student-name').value,
        surname: document.getElementById('student-surname').value,
        id: document.getElementById('student-id').value,
        course: document.getElementById('student-course').value,
        midtermScore:document.getElementById('student-midterm').value,
        finalScore:document.getElementById('student-final').value
        
    };
    saveStudent(student);
    displayStudents();
    e.target.reset();
});

//Add course form
document.getElementById('course-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var courseName = document.getElementById('course-name').value;
    var gradingScaleType = document.getElementById('grading-scale-select').value;

    addCourse(courseName, gradingScaleType);
});

// For toggle Feature
document.getElementById('show-students').addEventListener('click', function() {
    toggleStudents();
});
// For toggle Feature
document.getElementById('show-courses').addEventListener('click', function() {
    toggleCourses();
})
;// For toggle Feature
document.getElementById('toggle-students-by-course').addEventListener('click', function() {
    toggleStudentsByCourse();
});
// For toggle Feature
document.getElementById('calculate-grades').addEventListener('click', function() {
    toggleDisplayLetterGrades();
});
// Display students by their courses with toggle feature.
function toggleStudentsByCourse() {
    var studentsByCourseDiv = document.getElementById('results-container');
    if (studentsByCourseDiv.style.display === 'none' || studentsByCourseDiv.style.display === '') {
        displayStudentsByCourse();
        studentsByCourseDiv.style.display = 'block';
    } else {
        studentsByCourseDiv.style.display = 'none';
    }
}

document.getElementById('search-student-button').addEventListener('click', function() {
    var studentName = document.getElementById('student-name-search').value.toLowerCase();
     console.log(studentName);
    searchStudent(studentName);
   
});
// Display letter grades of students with toggle feature.
function toggleDisplayLetterGrades(){
    var studentsLetterGrades=document.getElementById('results-container');
    if(studentsLetterGrades.style.display==='none' || studentsLetterGrades.style.display===''){
        displayStudentGrades();
        studentsLetterGrades.style.display='block';
    }else{
        studentsLetterGrades.style.display='none';
    }
}
// Display students with toggle feature.
function toggleStudents(){
    var studentsDiv=document.getElementById('results-container');
    if(studentsDiv.style.display=='none' || studentsDiv.style.display==''){
        displayStudents();
        studentsDiv.style.display='block';
    }else{
        studentsDiv.style.display='none';
    }
}
// Display courses with toggle feature.
function toggleCourses(){
    var coursesDiv=document.getElementById('results-container');
    if (coursesDiv.style.display == 'none' || coursesDiv.style.display == ''){
        displayCourses();
        coursesDiv.style.display='block';
    }else{
        coursesDiv.style.display='none';
    }
}
// Save student
function saveStudent(student) {
    var students = JSON.parse(localStorage.getItem('students')) || [];

    // Öğrenci listesinde aynı ID'ye sahip bir öğrenci olup olmadığını kontrol et
    var existingStudent = students.find(s => s.id === student.id);

    if (existingStudent) {
        alert('Bu ID ile bir öğrenci zaten kayıtlı: ' + student.id);
        return; // Fonksiyonu erken sonlandır ve öğrenciyi ekleme
    }

    // Eğer notlar girilmemişse, "Not girilmemiş" olarak işaretle
    student.midtermScore = student.midtermScore || 'Not girilmemiş';
    student.finalScore = student.finalScore || 'Not girilmemiş';

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

// Delete Student
function deleteStudent(studentId) {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var updatedStudents = students.filter(student => student.id !== studentId);

    localStorage.setItem('students', JSON.stringify(updatedStudents));
}
// Add Course
function addCourse(courseName, gradingScaleType) {
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var gradingScale = {};
    var courseCredit = parseInt(document.getElementById('course-credit').value); // Kredi bilgisini al

    // Kredi değerinin 1 ile 8 arasında olduğunu kontrol et
    if (courseCredit < 1 || courseCredit > 8) {
        alert('Kredi değeri 1 ile 8 arasında olmalıdır.');
        return; // Fonksiyonu erken sonlandır
    }

    // Not ölçeğini ayarla
    if (gradingScaleType === '10') {
        gradingScale = {'A': 90, 'B': 80, 'C': 70, 'D': 60, 'F': 50};
    } else if (gradingScaleType === '7') {
        gradingScale = {'A': 7, 'B': 5, 'C': 3, 'D': 2, 'F': 1};
    }

    var courseExists = courses.some(course => course.name === courseName);
    if (!courseExists) {
        var newCourse = {
            name: courseName,
            gradingScale: gradingScale,
            gradingScaleType: gradingScaleType,
            credit: courseCredit // Kredi bilgisini ekle
        };
        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));

        addCourseToDropdown(newCourse);
        alert('Başarılı');splay
    } else {
        console.log(courseName + " zaten eklenmiş.");
    }
}

//adds this lesson he learned directly to the drop-down menu.
function addCourseToDropdown(course) {
    var courseSelect = document.getElementById('student-course');
    var option = document.createElement('option');
    option.value = course.name;
    option.textContent = course.name;
    courseSelect.appendChild(option);
}



function resetCourses() {
    localStorage.removeItem('courses');
}
function resetStudents(){
    localStorage.removeItem('students');
}


document.addEventListener('DOMContentLoaded', function() {
    loadCoursesToDropdown();
});


//Adds each lesson to the drop-down menu sequentially using a loop.
function loadCoursesToDropdown() {
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var courseSelect = document.getElementById('student-course');
    courses.forEach(function(course) {
        var option = document.createElement('option');
        option.value = course.name;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
}






function searchStudent(studentName) {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    studentName = studentName.trim().toLowerCase(); // Boşlukları kaldır ve küçük harfe çevir

    var filteredStudents = students.filter(student =>
        student.name.toLowerCase() === studentName || student.surname.toLowerCase() === studentName);

    var resultsHtml = '';
    if (filteredStudents.length > 0) {
        resultsHtml = '<table>';
        resultsHtml += '<tr><th>Ad</th><th>Soyad</th><th>Ders</th><th>Ara Sınav</th><th>Final</th></tr>'; // Tablo başlıkları

        filteredStudents.forEach(student => {
            resultsHtml += `<tr><td>${student.name}</td><td>${student.surname}</td><td>${student.course}</td><td>${student.midtermScore}</td><td>${student.finalScore}</td></tr>`;
        });

        resultsHtml += '</table>';
    } else if (filteredStudents.length<=2) {
        alert('Geçerli isim giriniz.'); // Tam eşleşme yoksa uyarı ver
      
    }

    document.getElementById('results-container').innerHTML = resultsHtml;
}



function searchLecture(lectureName) {
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var filteredLectures = courses.filter(course => 
        course.name.toLowerCase().includes(lectureName.toLowerCase()));

    var resultsHtml = '';
    if (filteredLectures.length > 0) {
        resultsHtml = '<ul>';
        filteredLectures.forEach(course => {
            resultsHtml += `<li>${course.name}</li>`; // Ders ismi listelenir
        });
        resultsHtml += '</ul>';
    } else {
        resultsHtml = '<p>Eşleşen ders bulunamadı.</p>';
    }

    document.getElementById('search-lecture-results"').innerHTML = resultsHtml; // ID'yi güncelledim
}
function displayCourses() {
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var courseListDiv = document.getElementById('results-container');

    if (courses.length === 0) {
        courseListDiv.innerHTML = '<p>Kayıtlı Kurs Bulunmamaktadır</p>';
        return;
    }

    var tableHtml = '<table border="1"><tr><th>Kurs Adı</th><th>Not Ölçeği Türü</th><th>Not Ölçeği</th><th>Kredi</th></tr>';
    courses.forEach(function(course) {
        tableHtml += `<tr><td>${course.name}</td><td>${course.gradingScaleType || 'Bilinmiyor'}</td><td>`;
        for (var grade in course.gradingScale) {
            tableHtml += `${grade}: ${course.gradingScale[grade]}, `;
        }
        tableHtml = tableHtml.slice(0, -2);
        tableHtml += `</td><td>${course.credit || 'Belirtilmemiş'}</td></tr>`; // Kredi bilgisini ekle
    });
    tableHtml += '</table>';

    courseListDiv.innerHTML = tableHtml;
}


function displayStudentsByCourse() {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var studentsByCourseDiv = document.getElementById('results-container');

    var listHtml = '';
    courses.forEach(function(course) {
        // Dersin adını ekle
        listHtml += `<h3>${course.name}</h3>`;

        // Dersle ilişkili öğrencileri filtrele
        var studentsInCourse = students.filter(student => student.course === course.name);

        if (studentsInCourse.length > 0) {
            // Öğrenciler varsa, tablo oluştur
            listHtml += '<table><tr><th>Ad</th><th>Soyad</th><th>Ara Sınav</th><th>Final</th></tr>';
            studentsInCourse.forEach(function(student) {
                var midtermScore = student.midtermScore || 'Not girilmemiş';
                var finalScore = student.finalScore || 'Not girilmemiş';
                listHtml += `<tr><td>${student.name}</td><td>${student.surname}</td><td>${midtermScore}</td><td>${finalScore}</td></tr>`;
            });
            listHtml += '</table>';
        } else {
            // Öğrenci yoksa, uyarı mesajı ekle
            listHtml += '<p>Kayıtlı öğrenci bulunamadı.</p>';
        }
    });

    studentsByCourseDiv.innerHTML = listHtml;
}


function displayStudents() {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var studentListDiv = document.getElementById('results-container');

    if (students.length === 0) {
        studentListDiv.innerHTML = '<p>Kayıtlı Öğrenci Bulunmamaktadır</p>';
        return;
    }

    var tableHtml = '<table><tr><th>ID</th><th>Ad</th><th>Soyad</th><th>Ders</th><th>Ara Sınav</th><th>Final</th><th>İşlem</th></tr>';
    students.forEach(function(student) {
        tableHtml += `<tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.surname}</td>
                        <td>${student.course}</td>
                        <td>${student.midtermScore}</td>
                        <td>${student.finalScore}</td>
                        <td><button onclick="deleteStudent('${student.id}')">Remove</button></td>
                      </tr>`;
    });
    tableHtml += '</table>';

    studentListDiv.innerHTML = tableHtml;
}

document.getElementById('show-courses').addEventListener('click', displayCourses);
document.getElementById('show-students').addEventListener('click', displayStudents);


function deleteStudent(studentId) {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var updatedStudents = students.filter(student => student.id !== studentId);

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    displayStudents(); // Listeyi güncelle

    alert(studentId + ' Numaralı Öğrenci Silindi.');
}

// Öğrenci Güncelleme Formunu İşleme
document.getElementById('update-student-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var studentId = document.getElementById('update-student-id').value;
    var updatedStudent = {
        name: document.getElementById('update-student-name').value,
        surname: document.getElementById('update-student-surname').value,
        midtermScore: document.getElementById('update-student-midterm').value,
        finalScore: document.getElementById('update-student-final').value
    };

    updateStudent(studentId, updatedStudent);
});

function updateStudent(studentId, updatedStudent) {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        students[studentIndex] = {...students[studentIndex], ...updatedStudent};
        localStorage.setItem('students', JSON.stringify(students));
        alert('Öğrenci bilgileri güncellendi.');
    } else {
        alert('Bu ID ile bir öğrenci bulunamadı.');
    }
}


function calculateLetterGrade(midtermScore, finalScore, gradingScale) {
    var totalScore = (midtermScore * 0.4) + (finalScore * 0.6); // Toplam puan hesaplanıyor

    // Not ölçeğinde tanımlı her bir harf notu için kontrol ediliyor
    for (var grade in gradingScale) {
        if (totalScore >= gradingScale[grade]) {
            return grade; // Eşleşen ilk harf notu döndürülüyor
        }
    }
    return 'F'; // Hiçbir kritere uymazsa 'F'
}
function displayStudentGrades() {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var courses = JSON.parse(localStorage.getItem('courses')) || [];
    var gradesHtml = '<ul>';

    students.forEach(function(student) {
        var course = courses.find(c => c.name === student.course);
        if (course) {
            var letterGrade = calculateLetterGrade(student.midtermScore, student.finalScore, course.gradingScale);
            gradesHtml += `<li>${student.name} ${student.surname}: ${letterGrade}</li>`;
        } else {
            gradesHtml += `<li>${student.name} ${student.surname}: Ders bilgisi bulunamadı</li>`;
        }
    });

    gradesHtml += '</ul>';
    document.getElementById('results-container').innerHTML = gradesHtml;
}