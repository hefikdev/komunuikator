import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Rozpoczęcie seedowania bazy danych...')

  // Usuń istniejące dane (opcjonalnie)
  await prisma.plik.deleteMany()
  await prisma.wiadomosc.deleteMany()
  await prisma.czlonekPokoju.deleteMany()
  await prisma.pokoj.deleteMany()
  await prisma.uzytkownik.deleteMany()

  // Utwórz użytkowników testowych
  const hasloHash = await bcrypt.hash('test123', 10)

  const user1 = await prisma.uzytkownik.create({
    data: {
      login: 'jan',
      haslo: hasloHash,
      email: 'jan@example.com',
      nazwaWyswietlana: 'Jan Kowalski',
    },
  })

  const user2 = await prisma.uzytkownik.create({
    data: {
      login: 'anna',
      haslo: hasloHash,
      email: 'anna@example.com',
      nazwaWyswietlana: 'Anna Nowak',
    },
  })

  const user3 = await prisma.uzytkownik.create({
    data: {
      login: 'piotr',
      haslo: hasloHash,
      nazwaWyswietlana: 'Piotr Wiśniewski',
    },
  })

  console.log('Utworzono użytkowników testowych')

  // Utwórz pokoje
  const pokoj1 = await prisma.pokoj.create({
    data: {
      nazwa: 'Ogólny',
      opis: 'Publiczny pokój dla wszystkich',
      czyPubliczny: true,
      czlonkowie: {
        create: [
          { uzytkownikId: user1.id },
          { uzytkownikId: user2.id },
          { uzytkownikId: user3.id },
        ],
      },
    },
  })

  const pokoj2 = await prisma.pokoj.create({
    data: {
      nazwa: 'Projekty',
      opis: 'Dyskusja o projektach',
      czyPubliczny: true,
      czlonkowie: {
        create: [
          { uzytkownikId: user1.id },
          { uzytkownikId: user2.id },
        ],
      },
    },
  })

  const pokoj3 = await prisma.pokoj.create({
    data: {
      nazwa: 'Prywatny pokój',
      opis: 'Pokój prywatny dla wybranych',
      czyPubliczny: false,
      czlonkowie: {
        create: [
          { uzytkownikId: user1.id },
          { uzytkownikId: user3.id },
        ],
      },
    },
  })

  console.log('Utworzono pokoje')

  // Utwórz przykładowe wiadomości
  await prisma.wiadomosc.create({
    data: {
      tresc: 'Witajcie! Jak się macie?',
      uzytkownikId: user1.id,
      pokojId: pokoj1.id,
    },
  })

  await prisma.wiadomosc.create({
    data: {
      tresc: 'Cześć! Świetnie, dzięki! 😊',
      uzytkownikId: user2.id,
      pokojId: pokoj1.id,
    },
  })

  await prisma.wiadomosc.create({
    data: {
      tresc: 'Witam wszystkich! Miło was poznać.',
      uzytkownikId: user3.id,
      pokojId: pokoj1.id,
    },
  })

  await prisma.wiadomosc.create({
    data: {
      tresc: 'Jak postępują prace nad projektem?',
      uzytkownikId: user1.id,
      pokojId: pokoj2.id,
    },
  })

  await prisma.wiadomosc.create({
    data: {
      tresc: 'Wszystko idzie zgodnie z planem! 👍',
      uzytkownikId: user2.id,
      pokojId: pokoj2.id,
    },
  })

  console.log('Utworzono przykładowe wiadomości')

  console.log('Seedowanie zakończone!')
  console.log('\nDane testowe:')
  console.log('Login: jan, Hasło: test123')
  console.log('Login: anna, Hasło: test123')
  console.log('Login: piotr, Hasło: test123')
}

main()
  .catch((e) => {
    console.error('Błąd podczas seedowania:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
