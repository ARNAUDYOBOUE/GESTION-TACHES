'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
  dueDate?: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: Date
  updatedAt: Date
  userId: number
}

export default function TasksPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')

  useEffect(() => {
    if (session?.user?.email) {
      fetchTasks()
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error)
    }
  }

  const handleAddTask = async () => {
    if (!title.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate || null,
          priority,
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([newTask, ...tasks])
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority('MEDIUM')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error)
    }
  }

  const handleToggle = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        )
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== id))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
    }
  }

  const handleEdit = async (id: number, newTitle: string, newDescription?: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      })

      if (response.ok) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id
              ? { ...task, title: newTitle, description: newDescription }
              : task
          )
        )
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la tâche:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête avec statut de connexion et bouton de déconnexion */}
      {session && (
        <div className="flex justify-between items-center bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          <div>
            Connecté en tant que {session.user?.email || 'utilisateur'}
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
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
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priority}
            onChange={e => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
          >
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
          </select>
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
              <div className="mt-2 flex gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  task.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.completed ? 'Accomplie' : 'À faire'}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  task.priority === 'HIGH' 
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority === 'HIGH' ? 'Haute' : task.priority === 'MEDIUM' ? 'Moyenne' : 'Basse'} priorité
                </span>
                {task.dueDate && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Échéance: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
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