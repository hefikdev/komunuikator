import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sprawdzHaslo, generujToken, walidujLogin } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { login, haslo } = await request.json()

    // Walidacja danych wejściowych
    if (!login || !haslo) {
      return NextResponse.json(
        { blad: 'Login i hasło są wymagane' },
        { status: 400 }
      )
    }

    if (!walidujLogin(login)) {
      return NextResponse.json(
        { blad: 'Nieprawidłowy format loginu' },
        { status: 400 }
      )
    }

    // Znajdź użytkownika
    const uzytkownik = await prisma.uzytkownik.findUnique({
      where: { login },
    })

    if (!uzytkownik) {
      return NextResponse.json(
        { blad: 'Nieprawidłowy login lub hasło' },
        { status: 401 }
      )
    }

    // Sprawdź hasło
    const czyPoprawneHaslo = await sprawdzHaslo(haslo, uzytkownik.haslo)

    if (!czyPoprawneHaslo) {
      return NextResponse.json(
        { blad: 'Nieprawidłowy login lub hasło' },
        { status: 401 }
      )
    }

    // Generuj token JWT
    const token = generujToken({
      uzytkownikId: uzytkownik.id,
      login: uzytkownik.login,
    })

    // Ustaw cookie z tokenem (HttpOnly dla bezpieczeństwa)
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: '/',
    })

    return NextResponse.json({
      sukces: true,
      uzytkownik: {
        id: uzytkownik.id,
        login: uzytkownik.login,
        nazwaWyswietlana: uzytkownik.nazwaWyswietlana,
      },
    })
  } catch (error) {
    console.error('Błąd logowania:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
