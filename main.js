const studentLists = {
    class6: { Boys: { A: [], B: [], C: [], D: [] }, Girls: { A: [], B: [], C: [], D: [] } },
    class7: { Boys: { A: [], B: [], C: [], D: [] }, Girls: { A: [], B: [], C: [], D: [] } },
    class8: { Boys: { A: [], B: [], C: [], D: [] }, Girls: { A: [], B: [], C: [], D: [] } },
    class9: { Boys: { A: [], B: [], C: [], D: [] }, Girls: { A: [], B: [], C: [], D: [] } },
    class10: { Boys: { A: ["Aihan", "Fahad", "Imran", "Mitab_Ahmed", "Raihan"], B: [], C: [], D: [] }, Girls: { A: [], B: [], C: [], D: [] } }
};

const phoneNumbers = {
    Aihan: "01711111111",
    Fahad: "01722222222",
    Imran: "01733333333",
    Mitab_Ahmed: "01744444444",
    Raihan: "01755555555"
};

let currentList = [];
let absentStudents = [];

function updateStudentList() {
    const classValue = document.getElementById('classSelect').value;
    const genderValue = document.getElementById('genderSelect').value;
    const batchValue = document.getElementById('batchSelect').value;

    if (!classValue || !genderValue || !batchValue) {
        return;
    }

    const listKey = `class${classValue}`;
    if (studentLists[listKey] && studentLists[listKey][genderValue] && studentLists[listKey][genderValue][batchValue]) {
        currentList = studentLists[listKey][genderValue][batchValue];
        renderStudentList();
    } else {
        currentList = [];
        document.getElementById('studentTable').innerHTML = '<p>No list available.</p>';
    }
}

function validateFields() {
    const classValue = document.getElementById('classSelect').value;
    const genderValue = document.getElementById('genderSelect').value;
    const batchValue = document.getElementById('batchSelect').value;

    if (!classValue || !genderValue || !batchValue) {
        alert('Please select class, gender, and batch.');
        return false;
    }
    return true;
}

function renderStudentList() {
    const tableBody = document.getElementById('studentTable');
    tableBody.innerHTML = '';
    if (currentList.length === 0) {
        tableBody.innerHTML = '<p>No students in this batch.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Name</th><th>Absent</th></tr></thead><tbody>';
    currentList.forEach(student => {
        html += `<tr><td>${student}</td><td><label class="toggle"><input type="checkbox" onchange="toggleAttendance('${student}')"><span class="slider"></span></label></td></tr>`;
    });
    html += '</tbody></table>';
    tableBody.innerHTML = html;
}

function toggleAttendance(name) {
    const index = absentStudents.indexOf(name);
    if (index === -1) {
        absentStudents.push(name);
    } else {
        absentStudents.splice(index, 1);
    }
}

function downloadPDF() {
    if (!validateFields()) return;

    if (absentStudents.length === 0) {
        alert('No absent students to download.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const classValue = document.getElementById('classSelect').value;
    const genderValue = document.getElementById('genderSelect').value;
    const batchValue = document.getElementById('batchSelect').value;

    const title = `Absent List for Class ${classValue} - ${genderValue} - Batch ${batchValue}`;
    const date = new Date();
    const timestamp = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    doc.text(title, 10, 10);
    doc.text(`Date: ${timestamp}`, 10, 20);
    doc.text('Absent Students:', 10, 30);
    absentStudents.forEach((student, index) => {
        const phone = phoneNumbers[student] || "N/A";
        doc.text(`${index + 1}. ${student} (Phone: ${phone})`, 10, 40 + index * 10);
    });

    doc.save(`AbsentList_${classValue}_${genderValue}_${batchValue}.pdf`);
}

function refreshPage() {
    location.reload();
}
