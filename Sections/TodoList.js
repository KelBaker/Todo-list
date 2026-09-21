"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './TodoList.module.scss'

export default function TodoList() {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || []
    setTasks(savedTasks)
    setCompletedTasks(savedCompletedTasks)
  }, [])

  const toggleTaskCompletion = (id) => {
    const taskToToggle = tasks.find((task) => task.id === id)
    const completedTaskToToggle = completedTasks.find((task) => task.id === id)

    if (taskToToggle) {
      const updatedTasks = tasks.filter((task) => task.id !== id)
      const updatedCompletedTasks = [...completedTasks, { ...taskToToggle, completed: true }]

      setTasks(updatedTasks)
      setCompletedTasks(updatedCompletedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks))
    } else if (completedTaskToToggle) {
      const updatedCompletedTasks = completedTasks.filter((task) => task.id !== id)
      const updatedTasks = [...tasks, { ...completedTaskToToggle, completed: false }]

      setCompletedTasks(updatedCompletedTasks)
      setTasks(updatedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks))
    }
  }

  const deleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id)
      const updatedCompletedTasks = completedTasks.filter((task) => task.id !== taskToDelete.id)
      setTasks(updatedTasks)
      setCompletedTasks(updatedCompletedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks))
      closeDeleteModal()
    }
  }

  const openDeleteModal = (task) => {
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setTaskToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const newTaskItem = { id: Date.now(), text: newTask.trim(), completed: false }
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTaskItem]
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      return updatedTasks
    })
    setIsModalOpen(false)
    setNewTask('')
  }

  const handleAddKeyDown = (event) => {
    if (event.key === 'Enter') addTask()
  }

  const openEditModal = (task) => {
    setTaskToEdit(task)
    setEditText(task.text)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setTaskToEdit(null)
    setEditText('')
    setIsEditModalOpen(false)
  }

  const saveEditedTask = () => {
    if (!taskToEdit || !editText.trim()) return

    const isCompleted = completedTasks.some((task) => task.id === taskToEdit.id)

    if (isCompleted) {
      const updatedCompletedTasks = completedTasks.map((task) =>
        task.id === taskToEdit.id ? { ...task, text: editText.trim() } : task
      )
      setCompletedTasks(updatedCompletedTasks)
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks))
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === taskToEdit.id ? { ...task, text: editText.trim() } : task
      )
      setTasks(updatedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }

    closeEditModal()
  }

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') saveEditedTask()
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.pageHeader}>
          <h2>Minhas tarefas</h2>
          <p>{tasks.length === 0 ? 'Tudo em dia por aqui.' : `${tasks.length} tarefa${tasks.length > 1 ? 's' : ''} pendente${tasks.length > 1 ? 's' : ''}`}</p>
        </div>

      <div className={styles.todoList}>
        <h3 className={styles.header}>Suas tarefas de hoje</h3>
        <ul className={styles.taskList}>
          {tasks.length === 0 ? (
            <li className={styles.emptyState}>
              <span className={styles.emptyIcon}>☑</span>
              Nenhuma tarefa pendente. Adicione uma abaixo.
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  id={`task-${task.id}`}
                  checked={false}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                <label htmlFor={`task-${task.id}`} className={styles.customCheckbox}></label>
                <span className={styles.taskText}>{task.text}</span>
                <button className={styles.editBtn} onClick={() => openEditModal(task)} aria-label="Editar tarefa">
                  ✏️
                </button>
                <button className={styles.deleteBtn} onClick={() => openDeleteModal(task)} aria-label="Deletar tarefa">
                  <Image src="/images/trash.svg" alt="" width={18} height={18} />
                </button>
              </li>
            ))
          )}
        </ul>

        <div className={styles.completedTasksSection}>
          <h3 className={styles.header}>Tarefas finalizadas</h3>
          {completedTasks.length === 0 ? (
            <p className={styles.emptyState}>Nenhuma tarefa concluída ainda.</p>
          ) : (
            <ul className={styles.completedTasksList}>
              {completedTasks.map((task) => (
                <li key={task.id} className={styles.completedTaskItem}>
                  <input
                    type="checkbox"
                    id={`completed-task-${task.id}`}
                    checked
                    onChange={() => toggleTaskCompletion(task.id)}
                    className={styles.checkbox}
                  />
                  <label htmlFor={`completed-task-${task.id}`} className={styles.customCheckbox}></label>
                  <span className={styles.taskText}>{task.text}</span>
                  <button className={styles.editBtn} onClick={() => openEditModal(task)} aria-label="Editar tarefa">
                    ✏️
                  </button>
                  <button className={styles.deleteBtn} onClick={() => openDeleteModal(task)} aria-label="Deletar tarefa">
                    <Image src="/images/trash.svg" alt="" width={18} height={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

        <button className={styles.addTaskBtn} onClick={() => setIsModalOpen(true)}>Adicionar nova tarefa</button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Nova tarefa</h3>
            <h4>Título</h4>
            <input
              type="text"
              placeholder="Digite"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleAddKeyDown}
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className={styles.addBtn} onClick={addTask}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Editar tarefa</h3>
            <h4>Título</h4>
            <input
              type="text"
              placeholder="Digite"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeEditModal}>Cancelar</button>
              <button className={styles.addBtn} onClick={saveEditedTask}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.deleteModal}`}>
            <h3>Deletar tarefa</h3>
            <p>Tem certeza que você deseja deletar essa tarefa?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeDeleteModal}>Cancelar</button>
              <button className={`${styles.addBtn} ${styles.confirmDeleteBtn}`} onClick={deleteTask}>Deletar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
