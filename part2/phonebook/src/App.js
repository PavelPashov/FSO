import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Entry = ({ person, DeletePerson }) => {
  return (
    <div>{person.name} {person.number} <button onClick={() => { if (window.confirm(`Delete ${person.name}`)) DeletePerson(person.id) }}>delete</button></div>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with: <input value={value} onChange={onChange} />
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll().then(initialNumbers => {
        setPersons(initialNumbers)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = { name: newName, number: newNumber }
    persons.some(entry => entry.name === person.name)
      ? updatePerson(person)
      : phonebookService.create(person).then(returned => setPersons(persons.concat(returned)))
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = person => {
    const existing = persons.find(p => p.name === person.name)
    if (window.confirm(`${person.name} is already added to phone book! Do you want to update the number?`)) {
      phonebookService.update(existing.id, person).then(returnedPerson => {
        setPersons(persons.map(p => p.id !== existing.id ? p : returnedPerson))
        console.log(returnedPerson)
      })
    }
  }

  const fitlerPeople = () => {
    return persons.filter(entry => entry.name.toLowerCase().includes(newFilter.toLowerCase()))
  }

  const onDeletePerson = (id) => {
    phonebookService.deleteNumber(id)
    setPersons(persons.filter(p => p.id !== id))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      < Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          <div>
            number: <input value={newNumber} onChange={handleNumberChange} />
          </div>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {fitlerPeople().map(person =>
        <Entry key={person.name} person={person} DeletePerson={onDeletePerson} />
      )}
    </div>

  )
}

export default App