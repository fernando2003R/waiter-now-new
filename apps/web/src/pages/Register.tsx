import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface RegisterForm {
  name: string
  email: string
  password: string
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>()
  const { register: registerUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password })
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch (error) {
      // Mensaje de error ya se maneja en useAuth.register
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Encabezado */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">WN</span>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Regístrate con tus datos básicos</p>
        </div>

        {/* Formulario simple */}
        <div className="card">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...formRegister('name', { required: 'El nombre es requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
                    type="text"
                    className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                    placeholder="Tu nombre"
                  />
                </div>
                {errors.name && (<p className="mt-1 text-sm text-error-600">{errors.name.message}</p>)}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...formRegister('email', {
                      required: 'El correo es requerido',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Correo inválido' }
                    })}
                    type="email"
                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="tu@correo.com"
                  />
                </div>
                {errors.email && (<p className="mt-1 text-sm text-error-600">{errors.email.message}</p>)}
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...formRegister('password', { required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                    type={showPassword ? 'text' : 'password'}
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && (<p className="mt-1 text-sm text-error-600">{errors.password.message}</p>)}
              </div>

              {/* Botón */}
              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            {/* Acciones secundarias */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">¿Ya tienes cuenta?</span>{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}