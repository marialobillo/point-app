// src/lib/auth.ts
import type { AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

export class AuthError extends Error {
  cause: SupabaseAuthError

  constructor(message: string, cause: SupabaseAuthError) {
    super(message)
    this.name = 'AuthError'
    this.cause = cause
  }
}

export async function signUp(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    throw new AuthError(`Failed to sign up: ${error.message}`, error)
  }

  return data.session
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new AuthError(`Failed to sign in: ${error.message}`, error)
  }

  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new AuthError(`Failed to sign out: ${error.message}`, error)
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new AuthError(`Failed to get session: ${error.message}`, error)
  }

  return data.session
}
