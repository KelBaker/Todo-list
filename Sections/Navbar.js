"use client"

import React, { useState, useEffect } from 'react'
import navbarStyles from './Navbar.module.scss'
import Data from "../Componentes/Data"
import dataStyles from '../Componentes/Data.module.css'

export default function Navbar() {
    const [name, setName] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const savedName = localStorage.getItem('userName')
        if (savedName) {
            setName(savedName)
        } else {
            setIsEditing(true)
        }
    }, [])

    const saveName = () => {
        const trimmed = inputValue.trim()
        if (!trimmed) return
        localStorage.setItem('userName', trimmed)
        setName(trimmed)
        setIsEditing(false)
    }

    const startEditing = () => {
        setInputValue(name || '')
        setIsEditing(true)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') saveName()
    }

    return (
        <nav className={navbarStyles.navbar}>
            <span className={navbarStyles.brand}>Tarefas</span>

            {isEditing ? (
                <input
                    type="text"
                    className={navbarStyles.nameInput}
                    placeholder="Como podemos te chamar?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={saveName}
                    autoFocus
                />
            ) : (
                <h1 onClick={startEditing} title="Clique para editar seu nome">
                    Bem-vindo de volta, {name}
                </h1>
            )}

            <div className={dataStyles.data}>
                <Data />
            </div>
        </nav>
    )
}
