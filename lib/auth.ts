import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'domyslny-sekret-zmien-w-produkcji'

export interface TokenPayload {
  uzytkownikId: string
  login: string
}

export async function hashujHaslo(haslo: string): Promise<string> {
  return bcrypt.hash(haslo, 10)
}

export async function sprawdzHaslo(haslo: string, hash: string): Promise<boolean> {
  return bcrypt.compare(haslo, hash)
}

export function generujToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function weryfikujToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

// Sanityzacja danych wejściowych - ochrona przed XSS
export function sanityzujTekst(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Walidacja nazwy użytkownika
export function walidujLogin(login: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(login)
}

// Walidacja hasła
export function walidujHaslo(haslo: string): boolean {
  return haslo.length >= 6
}
