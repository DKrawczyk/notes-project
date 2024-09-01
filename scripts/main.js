document.addEventListener('DOMContentLoaded', () => {
    const noteList = []
    const addNoteBtn = document.getElementById('add-note')
    const cancelBtn = document.querySelector('.cancel-click')
    const noNotesSection = document.querySelector('.no-content')
    const newNoteSection = document.querySelector('.adding-note')
    const noteTitle = document.getElementById('note-title')
    const noteContent = document.getElementById('note-content')
    const addButton = document.getElementById('insert-note')
    const errorMessage = document.getElementById('error-message')
    const noteForm = document.getElementById('note-form')
    const test = document.getElementById('test')
    const searchInput = document.getElementById('search')
    
    addNoteBtn.addEventListener('click', () => {
        noNotesSection.classList.toggle('hidden')
        newNoteSection.classList.toggle('hidden')
    })

    test.addEventListener('click', () => {
        newNoteSection.classList.toggle('hidden')
    })

    cancelBtn.addEventListener('click', () => {
        noNotesSection.classList.toggle('hidden')
        newNoteSection.classList.toggle('hidden')
        noteForm.reset()
    })

    const validateForm = () => {
        const title = noteTitle.value.trim()
        const content = noteContent.value.trim()

        errorMessage.textContent = ''

        if (title === '') {
            errorMessage.textContent = 'Note title cannot be empty.'
            addButton.classList.add('hidden')
            return false
        }

        if (content === '') {
            errorMessage.textContent = 'Note content cannot be empty.'
            addButton.classList.add('hidden')
            return false
        }

        if (content.length > 160) {
            errorMessage.textContent = 'Note content cannot exceed 160 characters.'
            addButton.classList.add('hidden')
            return false
        }

        addButton.classList.remove('hidden')
        return true
    }

    noteTitle.addEventListener('input', validateForm)
    noteContent.addEventListener('input', validateForm)

    const addNewNote = (newNote) => {
        const { title, content, date } = newNote

        const notesContainer = document.querySelector('.notes-wrapper')
        const notes = document.querySelector('.notes')
        notesContainer.classList.remove('hidden')

        const singleNote = document.createElement('div')
        singleNote.classList.add('single-note')

        notes.appendChild(singleNote)

        const titleInput = document.createElement('input')
        titleInput.value = title
        titleInput.disabled = true

        const contentInput = document.createElement('input')
        contentInput.value = content
        contentInput.disabled = true

        const dateSpan = document.createElement('span')
        dateSpan.classList.add('note-date')
        dateSpan.textContent = date

        const iconsWrapper = document.createElement('div')
        iconsWrapper.classList.add('icons-wrapper')

        const editButton = document.createElement('button')
        editButton.classList.add('icon-button')
        const editIcon = document.createElement('img')
        editIcon.src = '/icons/edit-icon.svg'
        editButton.appendChild(editIcon)

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('icon-button')
        const deleteIcon = document.createElement('img')
        deleteIcon.src = '/icons/bin-icon.svg'
        deleteButton.appendChild(deleteIcon)

        iconsWrapper.appendChild(editButton)
        iconsWrapper.appendChild(deleteButton)

        singleNote.appendChild(titleInput)
        singleNote.appendChild(contentInput)
        singleNote.appendChild(dateSpan)
        singleNote.appendChild(iconsWrapper)
    }

    noteForm.addEventListener('submit', (event) => {
        event.preventDefault()

        if (validateForm()) {
            alert('Note added successfully!')
            const formData = {
                title: noteTitle.value.trim(),
                content: noteContent.value.trim(),
                date: new Date().toLocaleDateString('pl-PL', { month: 'long', day: 'numeric' }),
            }
            console.log(formData)

            addNewNote(formData)

            addButton.classList.add('hidden')
            newNoteSection.classList.toggle('hidden')
            noteForm.reset()
        }
    })

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const notes = document.querySelectorAll('.single-note')
        
        notes.forEach(note => {
            const noteTitle = note.querySelector('input').value.toLocaleLowerCase()
            if (noteTitle.includes(searchTerm)) {
                note.style.display = 'block'
            } else {
                note.style.display = 'none'
            }
        })
    })
})
