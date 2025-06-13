let classes = JSON.parse(localStorage.getItem('classes')) || [];

const classList = document.getElementById('classList');
const addClassBtn = document.getElementById('addClassBtn');

function saveData() {
  localStorage.setItem('classes', JSON.stringify(classes));
}

function calculateClassAverage(cls) {
  const totalEarned = cls.assignments.reduce((acc, a) => acc + a.earned, 0);
  const totalPossible = cls.assignments.reduce((acc, a) => acc + a.total, 0);
  return totalPossible === 0 ? NaN : (totalEarned / totalPossible) * 100;
}

function renderClasses() {
  classList.innerHTML = '';
  classes.forEach((cls, index) => {
    const div = document.createElement('div');
    div.className = 'class-card';
    const avg = calculateClassAverage(cls);
    div.innerHTML = `
      <h3>${cls.name}</h3>
      <div class="grade">${isNaN(avg) ? 'No Grades' : avg.toFixed(2) + '%'}</div>
      <button onclick="deleteClass(${index}); event.stopPropagation();">Delete</button>
    `;
    div.onclick = () => {
      window.location.href = `class.html?id=${index}`;
    };
    classList.appendChild(div);
  });
}

addClassBtn.onclick = () => {
  const name = prompt('Enter class name:');
  if (name) {
    classes.push({ name, assignments: [] });
    saveData();
    renderClasses();
  }
};

function deleteClass(index) {
  if (confirm('Delete this class?')) {
    classes.splice(index, 1);
    saveData();
    renderClasses();
  }
}

renderClasses();
