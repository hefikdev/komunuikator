import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { weryfikujToken, sanityzujTekst } from '@/lib/auth'

const DOZWOLONE_TYPY = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]

const MAX_ROZMIAR = 10 * 1024 * 1024 // 10MB

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

    const formData = await request.formData()
    const plik = formData.get('plik') as File
    const pokojId = formData.get('pokojId') as string
    const tresc = formData.get('tresc') as string

    if (!plik) {
      return NextResponse.json({ blad: 'Plik jest wymagany' }, { status: 400 })
    }

    if (!pokojId) {
      return NextResponse.json(
        { blad: 'ID pokoju jest wymagane' },
        { status: 400 }
      )
    }

    // Walidacja typu pliku
    if (!DOZWOLONE_TYPY.includes(plik.type)) {
      return NextResponse.json(
        { blad: 'Niedozwolony typ pliku' },
        { status: 400 }
      )
    }

    // Walidacja rozmiaru
    if (plik.size > MAX_ROZMIAR) {
      return NextResponse.json(
        { blad: 'Plik jest za duży (max 10MB)' },
        { status: 400 }
      )
    }

    // Sprawdź dostęp do pokoju
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

    // Zapisz plik
    const bytes = await plik.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generuj unikalną nazwę pliku
    const timestamp = Date.now()
    const bezpiecznaNazwa = plik.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const nazwaPliku = `${timestamp}_${bezpiecznaNazwa}`
    const sciezka = join(process.cwd(), 'public', 'uploads', nazwaPliku)

    // Upewnij się że katalog istnieje
    await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true })

    await writeFile(sciezka, buffer)

    // Sanityzacja treści wiadomości
    const bezpiecznaTresc = tresc ? sanityzujTekst(tresc.trim()) : 'Wysłano plik'

    // Utwórz wiadomość z plikiem
    const nowaWiadomosc = await prisma.wiadomosc.create({
      data: {
        tresc: bezpiecznaTresc,
        uzytkownikId: payload.uzytkownikId,
        pokojId: pokojId,
        pliki: {
          create: {
            nazwaPliku: plik.name,
            sciezka: `/uploads/${nazwaPliku}`,
            rozmiar: plik.size,
            typMime: plik.type,
            uzytkownikId: payload.uzytkownikId,
          },
        },
      },
      include: {
        uzytkownik: {
          select: {
            login: true,
            nazwaWyswietlana: true,
          },
        },
        pliki: true,
      },
    })

    return NextResponse.json({ wiadomosc: nowaWiadomosc }, { status: 201 })
  } catch (error) {
    console.error('Błąd przesyłania pliku:', error)
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
