import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { weryfikujToken, sanityzujTekst } from '@/lib/auth'
import { LIMITY } from '@/lib/constants'

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const pokojId = searchParams.get('pokojId')

    if (!pokojId) {
      return NextResponse.json(
        { blad: 'ID pokoju jest wymagane' },
        { status: 400 }
      )
    }

    // Sprawdź czy użytkownik ma dostęp do pokoju
    const pokoj = await prisma.pokoj.findUnique({
      where: { id: pokojId },
      include: {
        czlonkowie: {
          where: {
            uzytkownikId: payload.uzytkownikId,
          },
        },
      },
    })

    if (!pokoj) {
      return NextResponse.json({ blad: 'Pokój nie istnieje' }, { status: 404 })
    }

    if (!pokoj.czyPubliczny && pokoj.czlonkowie.length === 0) {
      return NextResponse.json(
        { blad: 'Brak dostępu do tego pokoju' },
        { status: 403 }
      )
    }

    // Pobierz wiadomości
    const wiadomosci = await prisma.wiadomosc.findMany({
      where: { pokojId },
      include: {
        uzytkownik: {
          select: {
            login: true,
            nazwaWyswietlana: true,
          },
        },
        pliki: true,
      },
      orderBy: {
        utworzonaO: 'asc',
      },
      take: LIMITY.MAX_WIADOMOSCI, // Ostatnie wiadomości
    })

    return NextResponse.json({ wiadomosci })
  } catch (error) {
    console.error('Błąd pobierania wiadomości:', error)
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

    const { tresc, pokojId } = await request.json()

    if (!tresc || tresc.trim().length === 0) {
      return NextResponse.json(
        { blad: 'Treść wiadomości jest wymagana' },
        { status: 400 }
      )
    }

    if (!pokojId) {
      return NextResponse.json(
        { blad: 'ID pokoju jest wymagane' },
        { status: 400 }
      )
    }

    // Sprawdź czy pokój istnieje
    const pokoj = await prisma.pokoj.findUnique({
      where: { id: pokojId },
      include: {
        czlonkowie: {
          where: {
            uzytkownikId: payload.uzytkownikId,
          },
        },
      },
    })

    if (!pokoj) {
      return NextResponse.json({ blad: 'Pokój nie istnieje' }, { status: 404 })
    }

    if (!pokoj.czyPubliczny && pokoj.czlonkowie.length === 0) {
      return NextResponse.json(
        { blad: 'Brak dostępu do tego pokoju' },
        { status: 403 }
      )
    }

    // Dodaj użytkownika do członków pokoju jeśli jeszcze nie jest
    if (pokoj.czlonkowie.length === 0) {
      await prisma.czlonekPokoju.create({
        data: {
          uzytkownikId: payload.uzytkownikId,
          pokojId: pokojId,
        },
      })
    }

    // Sanityzacja treści wiadomości
    const bezpiecznaTresc = sanityzujTekst(tresc.trim())

    // Utwórz wiadomość
    const nowaWiadomosc = await prisma.wiadomosc.create({
      data: {
        tresc: bezpiecznaTresc,
        uzytkownikId: payload.uzytkownikId,
        pokojId: pokojId,
      },
      include: {
        uzytkownik: {
          select: {
            login: true,
            nazwaWyswietlana: true,
          },
        },
      },
    })

    return NextResponse.json({ wiadomosc: nowaWiadomosc }, { status: 201 })
  } catch (error) {
    console.error('Błąd tworzenia wiadomości:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
