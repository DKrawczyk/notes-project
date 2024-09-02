document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        addNoteBtn: document.getElementById('add-note'),
        cancelBtn: document.querySelector('.cancel-click'),
        noNotesSection: document.querySelector('.no-content'),
        newNoteSection: document.querySelector('.adding-note'),
        noteTitle: document.getElementById('note-title'),
        noteContent: document.getElementById('note-content'),
        addButton: document.getElementById('insert-note'),
        errorMessage: document.getElementById('error-message'),
        noteForm: document.getElementById('note-form'),
        addAnotherNoteBtn: document.getElementById('add-another-note'),
        searchInput: document.getElementById('search'),
        notesContainer: document.querySelector('.notes-wrapper'),
        notes: document.querySelector('.notes'),
    }

    const handleAddNoteClick = () => {
        elements.noNotesSection.classList.toggle('hidden')
        elements.newNoteSection.classList.toggle('hidden')
    }

    const handleAddAnotherNoteClick = () => {
        elements.notes.style.maxHeight = '340px'
        elements.newNoteSection.classList.toggle('hidden')
        elements.addAnotherNoteBtn.classList.add('hidden')
    }

    const handleCancelClick = () => {
        const allNotes = document.querySelectorAll('.single-note')
        elements.newNoteSection.classList.add('hidden')

        if (allNotes.length === 0) {
            elements.noNotesSection.classList.remove('hidden')
        } else {
            elements.addAnotherNoteBtn.classList.remove('hidden')
        }
        elements.notes.style.maxHeight = '650px'
        elements.noteForm.reset()
    }

    const handleNoteInputChange = () => {
        if (!validateForm()) {
            elements.addButton.classList.add('hidden')
        } else {
            elements.addButton.classList.remove('hidden')
        }
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()

        if (validateForm()) {
            const formData = {
                title: elements.noteTitle.value.trim(),
                content: elements.noteContent.value.trim(),
                date: new Date().toLocaleDateString('pl-PL', { month: 'long', day: 'numeric' }),
            }

            addNewNote(formData)

            elements.addButton.classList.add('hidden')
            elements.newNoteSection.classList.toggle('hidden')
            elements.addAnotherNoteBtn.classList.remove('hidden')
            elements.notes.style.maxHeight = '650px'
            elements.noteForm.reset()
        }
    }

    const handleSearchInput = () => {
        const allNotes = document.querySelectorAll('.single-note')
        const searchTerm = elements.searchInput.value.toLowerCase()

        allNotes.forEach((note) => {
            const noteTitle = note.querySelector('input').value.toLowerCase()
            note.style.display = noteTitle.includes(searchTerm) ? 'flex' : 'none'
        })
    }

    const validateForm = (existingTitle, existingContent) => {
        const title = existingTitle ? existingTitle : elements.noteTitle.value.trim()
        const content = existingContent ? existingContent : elements.noteContent.value.trim()

        elements.errorMessage.textContent = ''

        if (title === '') {
            elements.errorMessage.textContent = 'Note title cannot be empty.'
            return false
        }

        if (content === '') {
            elements.errorMessage.textContent = 'Note content cannot be empty.'
            return false
        }

        if (title.length > 30) {
            elements.errorMessage.textContent = 'Note title cannot exceed 30 characters.'
            return false
        }

        if (content.length > 160) {
            elements.errorMessage.textContent = 'Note content cannot exceed 160 characters.'
            return false
        }
        return true
    }

    const addNewNote = (newNote) => {
        const { title, content, date } = newNote

        elements.notesContainer.classList.remove('hidden')

        const singleNote = document.createElement('div')
        singleNote.classList.add('single-note')

        elements.notes.insertBefore(singleNote, elements.notes.firstChild)

        const titleInput = document.createElement('input')
        titleInput.value = title
        titleInput.disabled = true

        const contentSpan = document.createElement('span')
        contentSpan.classList.add('editable-span')
        contentSpan.textContent = content
        contentSpan.contentEditable = false

        const dateSpan = document.createElement('span')
        dateSpan.classList.add('note-date')
        dateSpan.textContent = date

        const iconsWrapper = document.createElement('div')
        iconsWrapper.classList.add('icons-wrapper')

        const editButton = createIconButton('/icons/edit-icon.svg')
        const deleteButton = createIconButton('/icons/bin-icon.svg')

        iconsWrapper.appendChild(editButton)
        iconsWrapper.appendChild(deleteButton)

        singleNote.appendChild(titleInput)
        singleNote.appendChild(contentSpan)
        singleNote.appendChild(dateSpan)
        singleNote.appendChild(iconsWrapper)

        deleteButton.addEventListener('click', () => {
            showModal(() => {
                elements.notes.removeChild(singleNote)
                checkIfNoNotesLeft()
            })
        })

        editButton.addEventListener('click', () => {
            const saveButton = document.createElement('button')
            saveButton.classList.add('primary-button', 'small', 'edit-button')
            saveButton.innerText = 'Save'

            elements.addAnotherNoteBtn.classList.add('hidden')
            titleInput.disabled = false
            contentSpan.contentEditable = true
            titleInput.classList.add('default-input')
            contentSpan.classList.add('default-input')

            iconsWrapper.style.display = 'none'
            contentSpan.focus()
            singleNote.appendChild(saveButton)

            saveButton.addEventListener('click', () => {
                const newTitle = titleInput.value.trim()
                const newContent = contentSpan.textContent.trim()
                if (validateForm(newTitle, newContent)) {
                    elements.addAnotherNoteBtn.classList.remove('hidden')
                    titleInput.disabled = true
                    contentSpan.contentEditable = false
                    titleInput.classList.remove('default-input')
                    contentSpan.classList.remove('default-input')
                    iconsWrapper.style.display = 'flex'
                    saveButton.remove()
                } else {
                    if (!singleNote.contains(elements.errorMessage)) {
                        singleNote.appendChild(elements.errorMessage)
                    }
                }
            })
        })
    }
    const createIconButton = (iconSrc) => {
        const button = document.createElement('button')
        button.classList.add('icon-button')
        const icon = document.createElement('img')
        icon.src = iconSrc
        button.appendChild(icon)
        return button
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
        if (elements.notes.children.length === 0) {
            elements.addAnotherNoteBtn.classList.add('hidden')
            elements.noNotesSection.classList.remove('hidden')
        }
    }

    elements.addNoteBtn.addEventListener('click', handleAddNoteClick)
    elements.addAnotherNoteBtn.addEventListener('click', handleAddAnotherNoteClick)
    elements.cancelBtn.addEventListener('click', handleCancelClick)
    elements.noteTitle.addEventListener('input', handleNoteInputChange)
    elements.noteContent.addEventListener('input', handleNoteInputChange)
    elements.noteForm.addEventListener('submit', handleFormSubmit)
    elements.searchInput.addEventListener('input', handleSearchInput)
})
