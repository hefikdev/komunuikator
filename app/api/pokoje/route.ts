import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { weryfikujToken, sanityzujTekst } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json({ blad: 'Brak autoryzacji' }, { status: 401 })
    }

    const payload = weryfikujToken(token.value)
    if (!payload) {
      return NextResponse.json({ blad: 'Nieprawidłowy token' }, { status: 401 })
    }

    // Pobierz pokoje publiczne oraz pokoje, do których użytkownik należy
    const pokoje = await prisma.pokoj.findMany({
      where: {
        OR: [
          { czyPubliczny: true },
          {
            czlonkowie: {
              some: {
                uzytkownikId: payload.uzytkownikId,
              },
            },
          },
        ],
      },
      orderBy: {
        utworzonyO: 'desc',
      },
    })

    return NextResponse.json({ pokoje })
  } catch (error) {
    console.error('Błąd pobierania pokoi:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json({ blad: 'Brak autoryzacji' }, { status: 401 })
    }

    const payload = weryfikujToken(token.value)
    if (!payload) {
      return NextResponse.json({ blad: 'Nieprawidłowy token' }, { status: 401 })
    }

    const { nazwa, opis, czyPubliczny } = await request.json()

    if (!nazwa || nazwa.trim().length === 0) {
      return NextResponse.json(
        { blad: 'Nazwa pokoju jest wymagana' },
        { status: 400 }
      )
    }

    // Sanityzacja nazwy i opisu
    const bezpiecznaNazwa = sanityzujTekst(nazwa.trim())
    const bezpiecznyOpis = opis ? sanityzujTekst(opis.trim()) : null

    // Utwórz pokój
    const nowyPokoj = await prisma.pokoj.create({
      data: {
        nazwa: bezpiecznaNazwa,
        opis: bezpiecznyOpis,
        czyPubliczny: czyPubliczny ?? true,
        czlonkowie: {
          create: {
            uzytkownikId: payload.uzytkownikId,
          },
        },
      },
    })

    return NextResponse.json({ pokoj: nowyPokoj }, { status: 201 })
  } catch (error) {
    console.error('Błąd tworzenia pokoju:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
