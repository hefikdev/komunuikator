import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashujHaslo, generujToken, walidujLogin, walidujHaslo } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { login, haslo, email, nazwaWyswietlana } = await request.json()

    // Walidacja danych wejściowych
    if (!login || !haslo) {
      return NextResponse.json(
        { blad: 'Login i hasło są wymagane' },
        { status: 400 }
      )
    }

    if (!walidujLogin(login)) {
      return NextResponse.json(
        { blad: 'Login musi zawierać 3-20 znaków (litery, cyfry, _)' },
        { status: 400 }
      )
    }

    if (!walidujHaslo(haslo)) {
      return NextResponse.json(
        { blad: 'Hasło musi mieć co najmniej 6 znaków' },
        { status: 400 }
      )
    }

    // Sprawdź czy użytkownik już istnieje
    const istniejacyUzytkownik = await prisma.uzytkownik.findUnique({
      where: { login },
    })

    if (istniejacyUzytkownik) {
      return NextResponse.json(
        { blad: 'Ten login jest już zajęty' },
        { status: 409 }
      )
    }

    // Sprawdź czy email już istnieje (jeśli podany)
    if (email) {
      const istniejacyEmail = await prisma.uzytkownik.findUnique({
        where: { email },
      })

      if (istniejacyEmail) {
        return NextResponse.json(
          { blad: 'Ten email jest już zajęty' },
          { status: 409 }
        )
      }
    }

    // Zahashuj hasło
    const zahaszowaneHaslo = await hashujHaslo(haslo)

    // Utwórz użytkownika
    const nowyUzytkownik = await prisma.uzytkownik.create({
      data: {
        login,
        haslo: zahaszowaneHaslo,
        email: email || null,
        nazwaWyswietlana: nazwaWyswietlana || login,
      },
    })

    // Generuj token JWT
    const token = generujToken({
      uzytkownikId: nowyUzytkownik.id,
      login: nowyUzytkownik.login,
    })

    // Ustaw cookie z tokenem
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
        id: nowyUzytkownik.id,
        login: nowyUzytkownik.login,
        nazwaWyswietlana: nowyUzytkownik.nazwaWyswietlana,
      },
    })
  } catch (error) {
    console.error('Błąd rejestracji:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
