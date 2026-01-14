import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { weryfikujToken } from '@/lib/auth'
import InterfejsCzatu from '@/components/czat/InterfejsCzatu'

export default async function CzatPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/logowanie')
  }

  const payload = weryfikujToken(token.value)
  if (!payload) {
    redirect('/logowanie')
  }

  return <InterfejsCzatu uzytkownik={payload} />
}
