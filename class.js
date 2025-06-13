let classes = JSON.parse(localStorage.getItem('classes')) || [];
const urlParams = new URLSearchParams(window.location.search);
const classId = parseInt(urlParams.get('id'), 10);
let currentClass = classes[classId];

if (!currentClass) {
  alert('Class not found.');
  window.location.href = 'index.html';
}

const classNameTitle = document.getElementById('classNameTitle');
const addAssignmentBtn = document.getElementById('addAssignmentBtn');
const assignmentsContainer = document.getElementById('assignmentsContainer');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const assignmentForm = document.getElementById('assignmentForm');
const assignmentName = document.getElementById('assignmentName');
const assignmentTotal = document.getElementById('assignmentTotal');
const assignmentEarned = document.getElementById('assignmentEarned');
const filterSelect = document.getElementById('filterSelect');
const backBtn = document.getElementById('backBtn');

let editIndex = null;

function saveData() {
  localStorage.setItem('classes', JSON.stringify(classes));
}

function openModal() {
  modal.classList.remove('hidden');
}

function closeModalFunc() {
  modal.classList.add('hidden');
  assignmentForm.reset();
  editIndex = null;
}

addAssignmentBtn.onclick = openModal;
closeModal.onclick = closeModalFunc;
backBtn.onclick = () => window.location.href = 'index.html';

assignmentForm.onsubmit = (e) => {
  e.preventDefault();

  const name = assignmentName.value.trim();
  const totalInput = assignmentTotal.value.trim();
  const earnedInput = assignmentEarned.value.trim();

  const total = totalInput === "" ? null : parseFloat(totalInput);
  const earned = earnedInput === "" ? null : parseFloat(earnedInput);

  if (!name) return;

  const assignment = {
    name,
    total: isNaN(total) ? null : total,
    earned: isNaN(earned) ? null : earned
  };

  if (editIndex !== null) {
    currentClass.assignments[editIndex] = assignment;
    editIndex = null;
  } else {
    currentClass.assignments.push(assignment);
  }

  saveData();
  renderAssignments();
  closeModalFunc();
};

function deleteAssignment(index) {
  if (confirm('Delete this assignment?')) {
    currentClass.assignments.splice(index, 1);
    saveData();
    renderAssignments();
  }
}

function editAssignment(index) {
  const a = currentClass.assignments[index];
  assignmentName.value = a.name;
  assignmentTotal.value = a.total !== null ? a.total : '';
  assignmentEarned.value = a.earned !== null ? a.earned : '';
  editIndex = index;
  openModal();
}

function renderAssignments() {
  assignmentsContainer.innerHTML = '';
  const filter = filterSelect.value;

  currentClass.assignments.forEach((a, index) => {
    const isGraded = a.earned !== null && a.total !== null && a.total !== 0;

    if (filter === 'notGraded' && isGraded) return;

    const gradeText = isGraded ? `${((a.earned / a.total) * 100).toFixed(2)}%` : 'N/A';
    const status = isGraded ? 'Graded' : 'Pending';
    const badgeClass = isGraded ? 'graded' : 'pending';

    const div = document.createElement('div');
    div.className = 'assignment-row';
    div.innerHTML = `
      <div class="assignment-left">
        <strong>${a.name}</strong><br>
        Grade: ${gradeText}
      </div>
      <div class="assignment-right">
        <span class="badge ${badgeClass}">${status}</span>
        <button onclick="editAssignment(${index})">Edit</button>
        <button onclick="deleteAssignment(${index})">Delete</button>
      </div>
    `;

    assignmentsContainer.appendChild(div);
  });
}

filterSelect.onchange = renderAssignments;

classNameTitle.textContent = `Class: ${currentClass.name}`;
renderAssignments();
