'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
}

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleAddTask = () => {
    if (!title.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
    }

    setTasks([newTask, ...tasks])
    setTitle('')
    setDescription('')
  }

  const handleToggle = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const handleEdit = (id: string, newTitle: string, newDescription?: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, title: newTitle, description: newDescription }
          : task
      )
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Affiche "Connecté" si la session existe */}
      {session && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center mb-6">
          Connecté en tant que {session.user?.email || 'utilisateur'}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mes Tâches</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Ajouter une tâche</h2>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleAddTask}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
          >
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-2 text-gray-600">{task.description}</p>
              )}
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                task.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {task.completed ? 'Accomplie' : 'À faire'}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  task.completed
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
                onClick={() => handleToggle(task.id)}
              >
                {task.completed ? 'Annuler' : 'Terminer'}
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                onClick={() => {
                  const newTitle = prompt('Modifier le titre', task.title)
                  const newDescription = prompt('Modifier la description', task.description || '')
                  if (newTitle !== null) {
                    handleEdit(task.id, newTitle, newDescription || undefined)
                  }
                }}
              >
                Modifier
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                onClick={() => handleDelete(task.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}