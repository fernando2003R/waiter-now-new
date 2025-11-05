import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'

interface LoginForm {
  email: string
  password: string
}

export function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>()
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMessage(null)
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al iniciar sesión'
      setErrorMessage(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Iniciar sesión</h1>

          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Correo</label>
              <input
                {...register('email', { required: 'El correo es obligatorio' })}
                id="email"
                type="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="tu@correo.com"
                onChange={() => setErrorMessage(null)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Contraseña</label>
              <input
                {...register('password', { required: 'La contraseña es obligatoria' })}
                id="password"
                type="password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
                onChange={() => setErrorMessage(null)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-primary-600 text-white rounded-md py-2 font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}