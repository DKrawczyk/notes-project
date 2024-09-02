document.addEventListener('DOMContentLoaded', () => {
    const addNoteBtn = document.getElementById('add-note')
    const cancelBtn = document.querySelector('.cancel-click')
    const noNotesSection = document.querySelector('.no-content')
    const newNoteSection = document.querySelector('.adding-note')
    const noteTitle = document.getElementById('note-title')
    const noteContent = document.getElementById('note-content')
    const addButton = document.getElementById('insert-note')
    const errorMessage = document.getElementById('error-message')
    const noteForm = document.getElementById('note-form')
    const addAnotherNoteBtn = document.getElementById('add-another-note')
    const searchInput = document.getElementById('search')
    const notesContainer = document.querySelector('.notes-wrapper')
    const notes = document.querySelector('.notes')

    addNoteBtn.addEventListener('click', () => {
        noNotesSection.classList.toggle('hidden')
        newNoteSection.classList.toggle('hidden')
    })

    addAnotherNoteBtn.addEventListener('click', () => {
        console.log(notes)
        notes.style.maxHeight = '340px'
        newNoteSection.classList.toggle('hidden')
        addAnotherNoteBtn.classList.add('hidden')
    })

    cancelBtn.addEventListener('click', () => {
        const allNotes = document.querySelectorAll('.single-note')
        newNoteSection.classList.add('hidden')

        if (allNotes.length === 0) {
            noNotesSection.classList.remove('hidden')
        } else {
            addAnotherNoteBtn.classList.remove('hidden')
        }
        notes.style.maxHeight = '650px'
        noteForm.reset()
    })

    const validateForm = (existingTitle, existingContent) => {
        const title = existingTitle ? existingTitle : noteTitle.value.trim()
        const content = existingContent ? existingContent : noteContent.value.trim()

        errorMessage.textContent = ''

        if (title === '') {
            errorMessage.textContent = 'Note title cannot be empty.'
            return false
        }

        if (content === '') {
            errorMessage.textContent = 'Note content cannot be empty.'
            return false
        }

        if (title.length > 30) {
            errorMessage.textContent = 'Note title cannot exceed 30 characters.'
            return false
        }

        if (content.length > 160) {
            errorMessage.textContent = 'Note content cannot exceed 160 characters.'
            return false
        }
        return true
    }

    noteTitle.addEventListener('input', () => {
        if (!validateForm()) {
            addButton.classList.add('hidden')
        } else {
            addButton.classList.remove('hidden')
        }
    })
    noteContent.addEventListener('input', () => {
        if (!validateForm()) {
            addButton.classList.add('hidden')
        } else {
            addButton.classList.remove('hidden')
        }
    })

    const addNewNote = (newNote) => {
        const { title, content, date } = newNote

        notesContainer.classList.remove('hidden')

        const singleNote = document.createElement('div')
        singleNote.classList.add('single-note')

        notes.insertBefore(singleNote, notes.firstChild)

        const titleInput = document.createElement('input')
        titleInput.value = title
        titleInput.disabled = true

        const textareaWrapper = document.createElement('div')
        textareaWrapper.classList.add('textarea-wrapper')

        const contentInput = document.createElement('textarea')
        contentInput.classList.add('editable-textarea')
        contentInput.value = content
        contentInput.disabled = true

        textareaWrapper.appendChild(contentInput)

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
        singleNote.appendChild(textareaWrapper)
        singleNote.appendChild(dateSpan)
        singleNote.appendChild(iconsWrapper)

        deleteButton.addEventListener('click', () => {
            showModal(() => {
                notes.removeChild(singleNote)
                checkIfNoNotesLeft()
            })
        })

        editButton.addEventListener('click', () => {
            const saveButton = document.createElement('button')
            saveButton.classList.add('primary-button', 'small', 'edit-button')
            saveButton.innerText = 'Save'

            addAnotherNoteBtn.classList.add('hidden')
            titleInput.disabled = false
            contentInput.disabled = false
            titleInput.classList.add('default-input')
            contentInput.classList.add('default-input')

            iconsWrapper.style.display = 'none'
            contentInput.style.minHeight = '210px'
            textareaWrapper.appendChild(saveButton)

            saveButton.addEventListener('click', () => {
                const newTitle = titleInput.value.trim()
                const newContent = contentInput.value.trim()
                if (validateForm(newTitle, newContent)) {
                    addAnotherNoteBtn.classList.remove('hidden')
                    titleInput.disabled = true
                    contentInput.disabled = true
                    titleInput.classList.remove('default-input')
                    contentInput.classList.remove('default-input')
                    iconsWrapper.style.display = 'flex'
                    contentInput.style.minHeight = ''
                    saveButton.remove()
                } else {
                    if (!singleNote.contains(errorMessage)) {
                        singleNote.appendChild(errorMessage)
                    }
                }
            })
        })
    }

    const showModal = (onConfirm) => {
        const modal = document.querySelector('.delete-modal')
        const overlay = document.querySelector('.overlay')
        const confirmButton = modal.querySelector('#confirm-delete')
        const cancelButton = modal.querySelector('#cancel-delete')
        overlay.classList.remove('hidden')
        modal.classList.remove('hidden')

        confirmButton.onclick = () => {
            onConfirm()
            modal.classList.add('hidden')
            overlay.classList.add('hidden')
        }

        cancelButton.onclick = () => {
            modal.classList.add('hidden')
            overlay.classList.add('hidden')
        }
    }

    const checkIfNoNotesLeft = () => {
        if (notes.children.length === 0) {
            addAnotherNoteBtn.classList.add('hidden')
            noNotesSection.classList.remove('hidden')
        }
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

            addNewNote(formData)

            addButton.classList.add('hidden')
            newNoteSection.classList.toggle('hidden')
            addAnotherNoteBtn.classList.remove('hidden')
            notes.style.maxHeight = '650px'
            noteForm.reset()
        }
    })

    searchInput.addEventListener('input', () => {
        const allNotes = document.querySelectorAll('.single-note')
        const searchTerm = searchInput.value.toLowerCase()
        console.log(allNotes)
        allNotes.forEach((note) => {
            const noteTitle = note.querySelector('input').value.toLocaleLowerCase()
            if (noteTitle.includes(searchTerm)) {
                note.style.display = 'flex'
            } else {
                note.style.display = 'none'
            }
        })
    })
})
