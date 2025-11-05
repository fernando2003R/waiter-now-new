import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: () => void
          renderButton: (element: HTMLElement, config: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

interface GoogleAuthConfig {
  client_id: string
  callback: (response: any) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
  use_fedcm_for_prompt?: boolean
  ux_mode?: string
  context?: string
}

export const useGoogleAuth = () => {
  const { loginWithGoogle } = useAuth()
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const initializeGoogleAuth = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const currentDomain = window.location.origin
    
    // Validar formato del Client ID de Google
    const isValidClientId = clientId && 
      clientId !== 'your_google_client_id_here' && 
      !clientId.includes('placeholder') &&
      clientId.includes('.apps.googleusercontent.com') &&
      clientId.length > 50 // Los Client IDs reales son mucho más largos
    
    if (!isValidClientId) {
      console.warn('⚠️ Google Client ID inválido o no configurado:', clientId)
      console.warn('📋 Para configurar Google OAuth:')
      console.warn('1. Ve a Google Cloud Console')
      console.warn('2. Crea credenciales OAuth 2.0')
      console.warn('3. Actualiza VITE_GOOGLE_CLIENT_ID en .env')
      setIsGoogleReady(false)
      return false
    }

    if (typeof window !== 'undefined' && window.google) {
      try {
        const config: GoogleAuthConfig = {
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
          ux_mode: 'popup',
          context: 'signin'
        }

        window.google.accounts.id.initialize(config)
        setIsGoogleReady(true)
        console.log('Google Auth inicializado correctamente en', currentDomain)
        return true
      } catch (error) {
        console.error('Error al inicializar Google Auth:', error)
        toast.error('Error al configurar Google OAuth')
        setIsGoogleReady(false)
        return false
      }
    }
    setIsGoogleReady(false)
    return false
  }, [setIsGoogleReady])

  const handleGoogleResponse = async (response: any) => {
    try {
      if (response.credential) {
        await loginWithGoogle(response.credential)
      } else {
        throw new Error('No se recibió credencial de Google')
      }
    } catch (error: any) {
      console.error('Error en autenticación con Google:', error)
      toast.error('Error al autenticar con Google')
    }
  }

  const signInWithGoogle = useCallback(async () => {
    if (isLoading) {
      console.log('Ya hay una operación de Google Auth en progreso')
      return
    }

    // Verificar Client ID antes de intentar autenticación
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const isValidClientId = clientId && 
      clientId !== 'your_google_client_id_here' && 
      !clientId.includes('placeholder') &&
      clientId.includes('.apps.googleusercontent.com') &&
      clientId.length > 50

    if (!isValidClientId) {
      toast.error('Google OAuth no está configurado correctamente. Revisa la consola para más detalles.')
      return
    }

    setIsLoading(true)
    
    try {
      if (!isGoogleReady) {
        console.log('Google Auth no está listo, intentando reinicializar...')
        const initialized = initializeGoogleAuth()
        
        if (!initialized) {
          throw new Error('No se pudo inicializar Google Auth - Client ID inválido')
        }
        
        // Esperar un poco para que se complete la inicialización
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (!isGoogleReady) {
          throw new Error('No se pudo inicializar Google Auth')
        }
      }

      console.log('Iniciando Google Sign-In...')
      
      // Usar el método renderButton en un elemento temporal para activar el popup
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      document.body.appendChild(tempDiv)
      
      window.google.accounts.id.renderButton(tempDiv, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        locale: 'es',
        click_listener: () => {
          console.log('Botón de Google clickeado')
        }
      })
      
      // Simular click en el botón
      setTimeout(() => {
        const button = tempDiv.querySelector('div[role="button"]') as HTMLElement
        if (button) {
          button.click()
        } else {
           // Fallback: usar prompt
           window.google.accounts.id.prompt()
         }
        
        // Limpiar elemento temporal
        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv)
          }
        }, 1000)
        
        setIsLoading(false)
      }, 100)
      
    } catch (error) {
      console.error('Error en signInWithGoogle:', error)
      toast.error('Error al iniciar sesión con Google')
      setIsLoading(false)
    }
  }, [isLoading, isGoogleReady, initializeGoogleAuth])

  const renderGoogleButton = useCallback((element: HTMLElement) => {
    if (!initializeGoogleAuth()) {
      return false
    }

    try {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        locale: 'es'
      })
      return true
    } catch (error) {
      console.error('Error al renderizar botón de Google:', error)
      return false
    }
  }, [initializeGoogleAuth])

  // Load Google Identity Services script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      initializeGoogleAuth()
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [initializeGoogleAuth])

  return {
    signInWithGoogle,
    renderGoogleButton,
    isLoading,
    isGoogleReady,
    isGoogleAuthAvailable: () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      return clientId && clientId !== 'your_google_client_id_here' && !clientId.includes('placeholder')
    }
  }
}