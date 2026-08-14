/* ==========================================================================
   BrightSparks Tutoring - Platform Dashboard & Operations JavaScript
   ========================================================================== */

// Quiz Questions Bank Data
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    subject: 'Primary Mathematics',
    question: 'Captain Sandy has 4 treasure chests. Each chest holds 6 gold coins. How many gold coins does Captain Sandy have in total?',
    options: ['18 coins', '24 coins', '20 coins', '28 coins'],
    correctIndex: 1,
    explanation: '4 chests × 6 coins each = 24 gold coins! Great multiplication work!',
    hint: 'Think of 4 groups of 6 (6 + 6 + 6 + 6).',
    points: 10,
  },
  {
    id: 'q2',
    subject: 'Science Explorers',
    question: 'Which planet in our solar system is known as the "Red Planet" because of iron oxide (rust) on its surface?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 1,
    explanation: 'Mars looks red in our night sky because of rust on its dusty surface!',
    hint: 'It is the 4th planet from the Sun and has huge rovers exploring it.',
    points: 10,
  },
  {
    id: 'q3',
    subject: 'English Phonics',
    question: 'In the word "MAGIC", what sound does the letter "G" make because it is followed by the vowel "I"?',
    options: ['Hard "G" sound (like "gate")', 'Soft "J" sound (like "gem")', 'Silent sound (not spoken)', 'Hissing "S" sound'],
    correctIndex: 1,
    explanation: 'When G is followed by E, I, or Y, it usually makes the soft "J" sound as in "magic" and "giraffe"!',
    hint: 'Listen to how you say "gym" or "giant".',
    points: 10,
  },
  {
    id: 'q4',
    subject: 'Brain Puzzles',
    question: 'Look at the number sequence: 3, 6, 12, 24, ___? What number comes next in the pattern?',
    options: ['30', '36', '48', '52'],
    correctIndex: 2,
    explanation: 'Each number is doubled (multiplied by 2). 24 × 2 = 48!',
    hint: 'Double the previous number each time.',
    points: 10,
  }
];

// Student Initial State
let currentQuizIdx = 0;
let totalStars = parseInt(localStorage.getItem('brightsparks_stars') || '480');
let streakDays = parseInt(localStorage.getItem('brightsparks_streak') || '7');

document.addEventListener('DOMContentLoaded', () => {
  initStudentDashboard();
  initParentDashboard();
  initAdminDashboard();
});

/* --- 1. Student & Kids Fun Zone Quiz Engine --- */
function initStudentDashboard() {
  updateStarDisplays();
  renderQuizQuestion(currentQuizIdx);

  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuizIdx > 0) {
        currentQuizIdx--;
        renderQuizQuestion(currentQuizIdx);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
        currentQuizIdx++;
        renderQuizQuestion(currentQuizIdx);
      }
    });
  }
}

function updateStarDisplays() {
  const starEls = document.querySelectorAll('.user-stars-count');
  starEls.forEach(el => el.textContent = totalStars);
  const streakEls = document.querySelectorAll('.user-streak-count');
  streakEls.forEach(el => el.textContent = streakDays);
}

function selectFunSubject(index) {
  currentQuizIdx = index % QUIZ_QUESTIONS.length;
  renderQuizQuestion(currentQuizIdx);
  const quizBox = document.querySelector('.quiz-box');
  if (quizBox) {
    quizBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (typeof showToast === 'function') {
    showToast(`Loaded ${QUIZ_QUESTIONS[currentQuizIdx].subject} Quiz! 🎮`, '🚀');
  }
}

function renderQuizQuestion(index) {
  const q = QUIZ_QUESTIONS[index];
  if (!q) return;

  const subjectEl = document.getElementById('quiz-subject-label');
  const questionEl = document.getElementById('quiz-question-text');
  const optionsBox = document.getElementById('quiz-options-container');
  const hintBtn = document.getElementById('quiz-hint-btn');
  const hintText = document.getElementById('quiz-hint-text');
  const expBox = document.getElementById('quiz-explanation-box');
  const expText = document.getElementById('quiz-explanation-text');
  const progressText = document.getElementById('quiz-progress-text');

  if (subjectEl) subjectEl.textContent = q.subject;
  if (questionEl) questionEl.textContent = q.question;
  if (progressText) progressText.textContent = `Question ${index + 1} of ${QUIZ_QUESTIONS.length}`;

  if (hintText) {
    hintText.textContent = q.hint;
    hintText.classList.add('hidden');
  }

  if (hintBtn) {
    hintBtn.onclick = () => {
      if (hintText) hintText.classList.toggle('hidden');
    };
  }

  if (expBox) expBox.classList.add('hidden');

  if (optionsBox) {
    optionsBox.innerHTML = '';
    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      const arrowSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
      const checkSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
      const crossSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`;
      const starSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

      btn.innerHTML = `<span>${String.fromCharCode(65 + optIdx)}. ${optText}</span> <span class="opt-icon flex items-center">${arrowSvg}</span>`;
      
      btn.addEventListener('click', () => {
        const allOpts = optionsBox.querySelectorAll('.quiz-option-btn');
        allOpts.forEach(b => b.disabled = true);

        if (optIdx === q.correctIndex) {
          btn.classList.add('selected-correct');
          btn.querySelector('.opt-icon').innerHTML = checkSvg;
          totalStars += q.points;
          localStorage.setItem('brightsparks_stars', totalStars);
          updateStarDisplays();
          if (typeof showToast === 'function') {
            showToast(`+${q.points} Star Coins! Brilliant Answer!`, starSvg);
          }
        } else {
          btn.classList.add('selected-wrong');
          btn.querySelector('.opt-icon').innerHTML = crossSvg;
          allOpts[q.correctIndex].classList.add('selected-correct');
        }

        if (expBox && expText) {
          expText.textContent = q.explanation;
          expBox.classList.remove('hidden');
        }
      });

      optionsBox.appendChild(btn);
    });
  }
}

/* --- 2. Parent Dashboard Multi-Child Switcher & Controls --- */
function initParentDashboard() {
  const childBtns = document.querySelectorAll('.parent-child-tab-btn');
  const childPanels = document.querySelectorAll('.parent-child-panel');
  const screenTimeSlider = document.getElementById('screen-time-slider');
  const screenTimeVal = document.getElementById('screen-time-val');

  if (childBtns.length > 0) {
    childBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const childId = btn.getAttribute('data-child-id');
        childBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
        childBtns.forEach(b => b.classList.add('btn-outline'));
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-outline');

        childPanels.forEach(p => {
          if (p.id === `panel-${childId}`) {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });
  }

  if (screenTimeSlider && screenTimeVal) {
    screenTimeSlider.addEventListener('input', (e) => {
      screenTimeVal.textContent = `${e.target.value} Mins/Day`;
    });

    screenTimeSlider.addEventListener('change', (e) => {
      if (typeof showToast === 'function') {
        showToast(`Daily Limit updated to ${e.target.value} minutes! ⏱️`, '🔒');
      }
    });
  }
}

/* --- 3. Admin Dashboard & Platform Operations Logic --- */
function initAdminDashboard() {
  // Master Role View Switcher Tabs (Parent vs Admin Dashboard)
  const roleTabs = document.querySelectorAll('.dash-role-tab');
  const viewPanels = document.querySelectorAll('.dash-view-panel');

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetViewId = tab.getAttribute('data-tab');
      if (!targetViewId) return;

      roleTabs.forEach(t => {
        t.classList.remove('active', 'btn-primary');
        t.classList.add('btn-outline');
      });
      tab.classList.add('active', 'btn-primary');
      tab.classList.remove('btn-outline');

      viewPanels.forEach(panel => {
        if (panel.id === targetViewId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // Admin Subtabs Switcher (Roster, Lessons, Quizzes, Subscriptions)
  const adminSubtabs = document.querySelectorAll('.admin-subtab-btn');
  const adminSubpanels = document.querySelectorAll('.admin-subpanel');

  adminSubtabs.forEach(subtab => {
    subtab.addEventListener('click', () => {
      const targetSubpanelId = subtab.getAttribute('data-subtab');
      if (!targetSubpanelId) return;

      adminSubtabs.forEach(st => {
        st.classList.remove('active', 'btn-primary');
        st.classList.add('btn-outline');
      });
      subtab.classList.add('active', 'btn-primary');
      subtab.classList.remove('btn-outline');

      adminSubpanels.forEach(sp => {
        if (sp.id === targetSubpanelId) {
          sp.classList.remove('hidden');
        } else {
          sp.classList.add('hidden');
        }
      });
    });
  });

  // Search & Grade Filter Logic for Admin Student Roster
  const searchInput = document.getElementById('admin-student-search');
  const gradeSelect = document.getElementById('admin-grade-filter');
  const studentRows = document.querySelectorAll('#admin-student-table tbody tr');

  function filterStudentTable() {
    const query = (searchInput?.value || '').toLowerCase();
    const grade = gradeSelect?.value || 'all';

    studentRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowGrade = row.getAttribute('data-grade');
      const matchesSearch = text.includes(query);
      const matchesGrade = grade === 'all' || rowGrade === grade;

      if (matchesSearch && matchesGrade) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterStudentTable);
  if (gradeSelect) gradeSelect.addEventListener('change', filterStudentTable);
}

/* --- Admin Row Action Helpers --- */
function editStudent(studentName) {
  if (typeof showToast === 'function') {
    showToast(`Opening edit modal for ${studentName}...`, '✏️');
  }
}

function toggleStudentStatus(btn) {
  const row = btn.closest('tr');
  const statusBadge = row.querySelector('td:nth-child(7) .badge');
  if (statusBadge.textContent.trim() === 'Active') {
    statusBadge.textContent = 'Paused';
    statusBadge.className = 'badge';
    statusBadge.style.background = '#FEE2E2';
    statusBadge.style.color = '#991B1B';
    btn.textContent = 'Activate';
    if (typeof showToast === 'function') showToast('Student account paused', '⏸️');
  } else {
    statusBadge.textContent = 'Active';
    statusBadge.className = 'badge badge-emerald';
    statusBadge.style.background = '';
    statusBadge.style.color = '';
    btn.textContent = 'Deactivate';
    if (typeof showToast === 'function') showToast('Student account activated!', '✅');
  }
}

function deleteStudentRow(btn) {
  const row = btn.closest('tr');
  const name = row.querySelector('td:first-child').textContent;
  if (confirm(`Are you sure you want to remove ${name} from the student roster?`)) {
    row.remove();
    if (typeof showToast === 'function') showToast(`${name} removed from roster`, '🗑️');
  }
}

function handleAddStudentSubmit(form) {
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const gradeSelect = form.querySelector('select');

  const name = nameInput.value;
  const email = emailInput.value;
  const grade = gradeSelect.value;

  const tbody = document.querySelector('#admin-student-table tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.setAttribute('data-grade', grade);
    tr.innerHTML = `
      <td style="padding: 0.75rem; font-weight: 700;">${name}</td>
      <td style="padding: 0.75rem; color: var(--text-muted);">${email}</td>
      <td style="padding: 0.75rem;"><span class="badge badge-primary">${grade}</span></td>
      <td style="padding: 0.75rem;">Math, Phonics</td>
      <td style="padding: 0.75rem;">
        <div class="flex items-center" style="gap: 0.5rem;">
          <div style="width: 70px; height: 6px; background: var(--border-color); border-radius: 3px;">
            <div style="width: 10%; height: 100%; background: var(--primary);"></div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700;">10%</span>
        </div>
      </td>
      <td style="padding: 0.75rem; font-weight: 800; color: var(--accent-emerald);">100%</td>
      <td style="padding: 0.75rem;"><span class="badge badge-emerald">Active</span></td>
      <td style="padding: 0.75rem;">
        <div class="flex" style="gap: 0.35rem;">
          <button class="btn btn-outline btn-sm" onclick="editStudent('${name}')">Edit</button>
          <button class="btn btn-outline btn-sm" onclick="toggleStudentStatus(this)">Deactivate</button>
          <button class="btn btn-outline btn-sm" style="color: #EF4444;" onclick="deleteStudentRow(this)">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }

  if (typeof showToast === 'function') {
    showToast(`🎉 Registered ${name} (${grade}) successfully!`, '🌟');
  }

  form.reset();
  const modal = document.getElementById('modal-add-student');
  if (modal) modal.classList.remove('active');
}

/* --- Avatar Shop Unlocking Logic --- */
function unlockAvatar(avatarName, starCost) {
  if (starCost === 0) {
    if (typeof showToast === 'function') showToast(`Equipped ${avatarName}!`, '🐱');
    return;
  }

  if (totalStars >= starCost) {
    totalStars -= starCost;
    localStorage.setItem('brightsparks_stars', totalStars);
    updateStarDisplays();
    if (typeof showToast === 'function') {
      showToast(`🎉 Unlocked & Equipped ${avatarName}! -${starCost} Stars`, '✨');
    }
    const btn = event.target;
    if (btn) {
      btn.textContent = 'Equipped';
      btn.className = 'btn btn-primary btn-sm';
      btn.onclick = () => showToast(`Equipped ${avatarName}!`);
    }
  } else {
    if (typeof showToast === 'function') {
      showToast(`You need ${starCost - totalStars} more Stars to unlock ${avatarName}! Solve more quizzes! 🪙`, '⚠️');
    }
  }
}
