import { useState } from 'react'
import { signIn, signUp } from '../services/authService'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      setMessage('Please enter your email and password.')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      if (isLogin) {
        await signIn(cleanEmail, password)
      } else {
        const result = await signUp(cleanEmail, password)

        if (!result.session) {
          setMessage(
            'Account created. Please check your email and confirm your account before logging in.',
          )
        } else {
          setMessage('Account created successfully.')
        }
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#f6f7f9',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              opacity: 0.6,
            }}
          >
            Clother
          </p>

          <h1 style={{ margin: '8px 0' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>

          <p style={{ margin: 0, opacity: 0.7 }}>
            {isLogin
              ? 'Sign in to access your wardrobe.'
              : 'Create an account to sync your wardrobe across devices.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            Email

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                marginTop: '8px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '15px',
              }}
            />
          </label>

          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            Password

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete={
                isLogin
                  ? 'current-password'
                  : 'new-password'
              }
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                marginTop: '8px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '15px',
              }}
            />
          </label>

          {message && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#f3f4f6',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: 0,
              borderRadius: '10px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? 'signup' : 'login')
            setMessage('')
          }}
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '8px',
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}