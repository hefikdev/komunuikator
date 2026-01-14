'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LogowaniePage() {
  const [login, setLogin] = useState('')
  const [haslo, setHaslo] = useState('')
  const [blad, setBlad] = useState('')
  const [ladowanie, setLadowanie] = useState(false)
  const router = useRouter()

  const obsluzWyslanie = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlad('')
    setLadowanie(true)

    try {
      const odpowiedz = await fetch('/api/auth/logowanie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, haslo }),
      })

      const dane = await odpowiedz.json()

      if (odpowiedz.ok) {
        router.push('/czat')
        router.refresh()
      } else {
        setBlad(dane.blad || 'Błąd logowania')
      }
    } catch (error) {
      setBlad('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLadowanie(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={obsluzWyslanie} className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium mb-1">
                Login
              </label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={ladowanie}
                placeholder="Wprowadź login"
              />
            </div>
            <div>
              <label htmlFor="haslo" className="block text-sm font-medium mb-1">
                Hasło
              </label>
              <Input
                id="haslo"
                type="password"
                value={haslo}
                onChange={(e) => setHaslo(e.target.value)}
                required
                disabled={ladowanie}
                placeholder="Wprowadź hasło"
              />
            </div>
            {blad && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {blad}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={ladowanie}>
              {ladowanie ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Nie masz konta?{' '}
              <Link href="/rejestracja" className="text-primary hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
