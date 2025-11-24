document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop();

  // --- Fungsi Umum Alert ---
  function showAlert(message, icon = '⚠️', onConfirm = null, isConfirm = true, alertId = 'customAlert') {
    const alertDiv = document.getElementById(alertId);
    const alertMessage = alertDiv.querySelector('#alertMessage');
    const alertIcon = alertDiv.querySelector('#alertIcon');
    const alertButtons = alertDiv.querySelector('.alert-buttons');
    const alertConfirm = alertDiv.querySelector('#alertConfirm');
    const alertCancel = alertDiv.querySelector('#alertCancel');
    const successConfirm = alertDiv.querySelector('#successConfirm');

    alertMessage.textContent = message;
    alertIcon.textContent = icon;

    if (isConfirm && alertId === 'customAlert') {
      alertButtons.style.display = 'flex';
      alertCancel.style.display = 'block';
      alertConfirm.onclick = () => {
        if (onConfirm) onConfirm();
        closeAlert(alertDiv);
      };
      alertCancel.onclick = () => closeAlert(alertDiv);
    } else if (alertId === 'successAlert') {
      alertButtons.style.display = 'flex';
      alertCancel.style.display = 'none';
      successConfirm.onclick = () => closeAlert(alertDiv);
    } else {
      alertButtons.style.display = 'flex';
      alertCancel.style.display = 'none';
      alertConfirm.onclick = () => {
        if (onConfirm) onConfirm();
        closeAlert(alertDiv);
      };
    }

    alertDiv.classList.remove('hidden');
    setTimeout(() => alertDiv.classList.add('show'), 10);

    function closeAlert(el) {
      el.classList.remove('show');
      setTimeout(() => el.classList.add('hidden'), 300);
    }
  }

  if (currentPath === 'index.html') {
    // --- Halaman Index: Tambah Tag ---
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');

    addTagBtn.addEventListener('click', addTag);
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });

    function addTag() {
      const text = tagInput.value.trim();
      if (!text) return;

      let tags = JSON.parse(localStorage.getItem('tags')) || [];
      if (tags.includes(text)) {
        showAlert('Tag ini sudah ada! 🚫', '🔁', null, false, 'customAlert');
        return;
      }

      tags.push(text);
      localStorage.setItem('tags', JSON.stringify(tags));
      tagInput.value = '';
      tagInput.focus();
    }

    tagInput.focus();

  } else if (currentPath === 'tags.html') {
    // --- Halaman Tags: Lihat, Edit, Hapus ---
    const tagsContainer = document.getElementById('tagsContainer');

    let tags = JSON.parse(localStorage.getItem('tags')) || [];

    // Buat elemen tag
    function createTagElement(text) {
      const tagDiv = document.createElement('div');
      tagDiv.className = 'tag';
      tagDiv.innerHTML = `
        <span>${text}</span>
        <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" title="Hapus"><i class="fas fa-trash"></i></button>
      `;

      const span = tagDiv.querySelector('span');
      const editBtn = tagDiv.querySelector('.edit-btn');
      const deleteBtn = tagDiv.querySelector('.delete-btn');

      editBtn.addEventListener('click', () => {
        const current = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = current;
        span.replaceWith(input);
        input.focus();

        const save = () => {
          const newVal = input.value.trim();
          if (newVal && newVal !== current && !tags.includes(newVal)) {
            const idx = tags.indexOf(current);
            if (idx !== -1) {
              tags[idx] = newVal;
              span.textContent = newVal;
              localStorage.setItem('tags', JSON.stringify(tags));
              input.replaceWith(span);
              // Tampilkan alert sukses edit
              showAlert('Tag berhasil diedit! ✅', '✏️', null, false, 'successAlert');
            }
          } else if (!newVal) {
            span.textContent = current;
            input.replaceWith(span);
          } else if (tags.includes(newVal)) {
            showAlert('Tag sudah ada!', '🔁', null, false, 'customAlert');
            span.textContent = current;
            input.replaceWith(span);
          } else {
            span.textContent = current;
            input.replaceWith(span);
          }
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') {
            span.textContent = current;
            input.replaceWith(span);
          }
        });
      });

      deleteBtn.addEventListener('click', () => {
        const tagText = span.textContent;
        showAlert(
          `Yakin ingin menghapus tag "${tagText}"?`,
          '🗑️',
          () => {
            const idx = tags.indexOf(tagText);
            if (idx !== -1) {
              tags.splice(idx, 1);
              localStorage.setItem('tags', JSON.stringify(tags));
              tagDiv.remove();
            }
          },
          true,
          'customAlert'
        );
      });

      return tagDiv;
    }

    // Muat tag dari localStorage
    function loadTags() {
      tagsContainer.innerHTML = '';
      tags.forEach(tag => {
        const tagEl = createTagElement(tag);
        tagsContainer.appendChild(tagEl);
      });
    }

    loadTags(); // Muat saat halaman dibuka

    // Update jika tag berubah dari halaman lain
    window.addEventListener('storage', (e) => {
      if (e.key === 'tags') {
        tags = JSON.parse(e.newValue) || [];
        loadTags();
      }
    });
  }
});

// --- Toggle Menu Mobile ---
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}