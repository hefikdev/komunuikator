'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Send, LogOut, Users, Plus, Smile, Paperclip } from 'lucide-react'

interface Uzytkownik {
  uzytkownikId: string
  login: string
}

interface Pokoj {
  id: string
  nazwa: string
  czyPubliczny: boolean
}

interface Wiadomosc {
  id: string
  tresc: string
  uzytkownikId: string
  uzytkownik: {
    login: string
    nazwaWyswietlana: string | null
  }
  utworzonaO: string
  pliki?: Plik[]
}

interface Plik {
  id: string
  nazwaPliku: string
  sciezka: string
  rozmiar: number
}

const EMOTIKONY = ['😀', '😂', '😍', '👍', '❤️', '🎉', '🔥', '💯', '😎', '🤔', '👏', '🙏']

export default function InterfejsCzatu({ uzytkownik }: { uzytkownik: Uzytkownik }) {
  const [pokoje, setPokoje] = useState<Pokoj[]>([])
  const [wybranyPokoj, setWybranyPokoj] = useState<string | null>(null)
  const [wiadomosci, setWiadomosci] = useState<Wiadomosc[]>([])
  const [nowaWiadomosc, setNowaWiadomosc] = useState('')
  const [pokazEmotikony, setPokazEmotikony] = useState(false)
  const [nowaNazwaPokoju, setNowaNazwaPokoju] = useState('')
  const [pokazNowyPokoj, setPokazNowyPokoj] = useState(false)
  const [czyPubliczny, setCzyPubliczny] = useState(true)
  const [wybranyPlik, setWybranyPlik] = useState<File | null>(null)
  const [przesylanieWToku, setPrzesylanieWToku] = useState(false)
  const wiadomosciRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    pobierzPokoje()
    const interval = setInterval(() => {
      if (wybranyPokoj) {
        pobierzWiadomosci(wybranyPokoj)
      }
    }, 2000) // Odświeżanie co 2 sekundy
    return () => clearInterval(interval)
  }, [wybranyPokoj])

  useEffect(() => {
    if (wiadomosciRef.current) {
      wiadomosciRef.current.scrollTop = wiadomosciRef.current.scrollHeight
    }
  }, [wiadomosci])

  const pobierzPokoje = async () => {
    try {
      const odpowiedz = await fetch('/api/pokoje')
      if (odpowiedz.ok) {
        const dane = await odpowiedz.json()
        setPokoje(dane.pokoje)
        if (dane.pokoje.length > 0 && !wybranyPokoj) {
          setWybranyPokoj(dane.pokoje[0].id)
        }
      }
    } catch (error) {
      console.error('Błąd pobierania pokoi:', error)
    }
  }

  const pobierzWiadomosci = async (pokojId: string) => {
    try {
      const odpowiedz = await fetch(`/api/wiadomosci?pokojId=${pokojId}`)
      if (odpowiedz.ok) {
        const dane = await odpowiedz.json()
        setWiadomosci(dane.wiadomosci)
      }
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error)
    }
  }

  const wyslij = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!nowaWiadomosc.trim() && !wybranyPlik) || !wybranyPokoj || przesylanieWToku) return

    setPrzesylanieWToku(true)

    try {
      if (wybranyPlik) {
        // Prześlij plik
        const formData = new FormData()
        formData.append('plik', wybranyPlik)
        formData.append('pokojId', wybranyPokoj)
        formData.append('tresc', nowaWiadomosc.trim() || 'Wysłano plik')

        const odpowiedz = await fetch('/api/pliki', {
          method: 'POST',
          body: formData,
        })

        if (odpowiedz.ok) {
          setNowaWiadomosc('')
          setWybranyPlik(null)
          await pobierzWiadomosci(wybranyPokoj)
        }
      } else {
        // Wyślij tylko wiadomość tekstową
        const odpowiedz = await fetch('/api/wiadomosci', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tresc: nowaWiadomosc,
            pokojId: wybranyPokoj,
          }),
        })

        if (odpowiedz.ok) {
          setNowaWiadomosc('')
          await pobierzWiadomosci(wybranyPokoj)
        }
      }
    } catch (error) {
      console.error('Błąd wysyłania:', error)
    } finally {
      setPrzesylanieWToku(false)
    }
  }

  const utworzPokoj = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nowaNazwaPokoju.trim()) return

    try {
      const odpowiedz = await fetch('/api/pokoje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nazwa: nowaNazwaPokoju,
          czyPubliczny,
        }),
      })

      if (odpowiedz.ok) {
        setNowaNazwaPokoju('')
        setPokazNowyPokoj(false)
        await pobierzPokoje()
      }
    } catch (error) {
      console.error('Błąd tworzenia pokoju:', error)
    }
  }

  const wyloguj = async () => {
    await fetch('/api/auth/wyloguj', { method: 'POST' })
    router.push('/logowanie')
    router.refresh()
  }

  const dodajEmotikon = (emotikon: string) => {
    setNowaWiadomosc(nowaWiadomosc + emotikon)
    setPokazEmotikony(false)
  }

  const obsluzWyborPliku = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWybranyPlik(e.target.files[0])
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Panel boczny z pokojami */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-primary text-primary-foreground">
          <h2 className="font-bold text-lg">Komunikator</h2>
          <p className="text-sm opacity-90">Witaj, {uzytkownik.login}!</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground">POKOJE</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPokazNowyPokoj(!pokazNowyPokoj)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {pokazNowyPokoj && (
            <form onSubmit={utworzPokoj} className="mb-4 space-y-2">
              <Input
                placeholder="Nazwa pokoju"
                value={nowaNazwaPokoju}
                onChange={(e) => setNowaNazwaPokoju(e.target.value)}
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publiczny"
                  checked={czyPubliczny}
                  onChange={(e) => setCzyPubliczny(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="publiczny" className="text-sm">
                  Publiczny
                </label>
              </div>
              <Button type="submit" size="sm" className="w-full">
                Utwórz
              </Button>
            </form>
          )}

          <div className="space-y-1">
            {pokoje.map((pokoj) => (
              <button
                key={pokoj.id}
                onClick={() => setWybranyPokoj(pokoj.id)}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                  wybranyPokoj === pokoj.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="truncate">{pokoj.nazwa}</span>
                {!pokoj.czyPubliczny && (
                  <span className="text-xs opacity-70">🔒</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={wyloguj}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </Button>
        </div>
      </div>

      {/* Główny obszar czatu */}
      <div className="flex-1 flex flex-col">
        {wybranyPokoj ? (
          <>
            {/* Nagłówek czatu */}
            <div className="bg-white border-b p-4">
              <h2 className="font-bold text-xl">
                {pokoje.find((p) => p.id === wybranyPokoj)?.nazwa}
              </h2>
            </div>

            {/* Wiadomości */}
            <div
              ref={wiadomosciRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {wiadomosci.map((wiadomosc) => (
                <div
                  key={wiadomosc.id}
                  className={`flex ${
                    wiadomosc.uzytkownikId === uzytkownik.uzytkownikId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <Card
                    className={`max-w-md ${
                      wiadomosc.uzytkownikId === uzytkownik.uzytkownikId
                        ? 'bg-primary text-primary-foreground'
                        : ''
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="font-semibold text-sm mb-1">
                        {wiadomosc.uzytkownik.nazwaWyswietlana ||
                          wiadomosc.uzytkownik.login}
                      </p>
                      <p className="break-words">{wiadomosc.tresc}</p>
                      {wiadomosc.pliki && wiadomosc.pliki.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {wiadomosc.pliki.map((plik) => (
                            <a
                              key={plik.id}
                              href={plik.sciezka}
                              download
                              className="flex items-center gap-2 text-sm underline hover:no-underline"
                            >
                              <Paperclip className="h-3 w-3" />
                              {plik.nazwaPliku} ({Math.round(plik.rozmiar / 1024)}KB)
                            </a>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(wiadomosc.utworzonaO).toLocaleTimeString('pl-PL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Formularz wiadomości */}
            <div className="bg-white border-t p-4">
              {wybranyPlik && (
                <div className="mb-2 p-2 bg-secondary rounded flex items-center justify-between">
                  <span className="text-sm truncate">
                    {wybranyPlik.name}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setWybranyPlik(null)}
                  >
                    ✕
                  </Button>
                </div>
              )}
              <form onSubmit={wyslij} className="flex gap-2">
                <input
                  type="file"
                  id="plik"
                  className="hidden"
                  onChange={obsluzWyborPliku}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => document.getElementById('plik')?.click()}
                  disabled={przesylanieWToku}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPokazEmotikony(!pokazEmotikony)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  {pokazEmotikony && (
                    <div className="absolute bottom-full mb-2 bg-white border rounded-lg p-2 shadow-lg grid grid-cols-6 gap-1">
                      {EMOTIKONY.map((emotikon) => (
                        <button
                          key={emotikon}
                          type="button"
                          onClick={() => dodajEmotikon(emotikon)}
                          className="text-2xl hover:bg-secondary rounded p-1"
                        >
                          {emotikon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Napisz wiadomość..."
                  value={nowaWiadomosc}
                  onChange={(e) => setNowaWiadomosc(e.target.value)}
                  className="flex-1"
                  disabled={przesylanieWToku}
                />
                <Button type="submit" disabled={przesylanieWToku}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Wybierz pokój, aby rozpocząć czat</p>
          </div>
        )}
      </div>
    </div>
  )
}
