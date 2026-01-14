'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RejestracjaPage() {
  const [login, setLogin] = useState('')
  const [haslo, setHaslo] = useState('')
  const [potwierdzHaslo, setPotwierdzHaslo] = useState('')
  const [email, setEmail] = useState('')
  const [nazwaWyswietlana, setNazwaWyswietlana] = useState('')
  const [blad, setBlad] = useState('')
  const [ladowanie, setLadowanie] = useState(false)
  const router = useRouter()

  const obsluzWyslanie = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlad('')

    if (haslo !== potwierdzHaslo) {
      setBlad('Hasła nie są identyczne')
      return
    }

    if (haslo.length < 6) {
      setBlad('Hasło musi mieć co najmniej 6 znaków')
      return
    }

    setLadowanie(true)

    try {
      const odpowiedz = await fetch('/api/auth/rejestracja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, haslo, email, nazwaWyswietlana }),
      })

      const dane = await odpowiedz.json()

      if (odpowiedz.ok) {
        router.push('/czat')
        router.refresh()
      } else {
        setBlad(dane.blad || 'Błąd rejestracji')
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
          <CardTitle className="text-2xl text-center">Rejestracja</CardTitle>
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
                placeholder="3-20 znaków (litery, cyfry, _)"
              />
            </div>
            <div>
              <label htmlFor="nazwaWyswietlana" className="block text-sm font-medium mb-1">
                Nazwa wyświetlana (opcjonalna)
              </label>
              <Input
                id="nazwaWyswietlana"
                type="text"
                value={nazwaWyswietlana}
                onChange={(e) => setNazwaWyswietlana(e.target.value)}
                disabled={ladowanie}
                placeholder="Twoja nazwa"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email (opcjonalny)
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={ladowanie}
                placeholder="twoj@email.com"
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
                placeholder="Minimum 6 znaków"
              />
            </div>
            <div>
              <label htmlFor="potwierdzHaslo" className="block text-sm font-medium mb-1">
                Potwierdź hasło
              </label>
              <Input
                id="potwierdzHaslo"
                type="password"
                value={potwierdzHaslo}
                onChange={(e) => setPotwierdzHaslo(e.target.value)}
                required
                disabled={ladowanie}
                placeholder="Powtórz hasło"
              />
            </div>
            {blad && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {blad}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={ladowanie}>
              {ladowanie ? 'Rejestracja...' : 'Zarejestruj się'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Masz już konto?{' '}
              <Link href="/logowanie" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
