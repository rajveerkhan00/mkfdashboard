import { NextResponse } from 'next/server'
import { getRedirections, createRedirection } from '@/lib/redirections'

export async function GET() {
  try {
    const redirections = await getRedirections()
    return NextResponse.json(redirections)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch redirections' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    if (!data.from || !data.to || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, type' }, 
        { status: 400 }
      )
    }
    
    // Ensure from path starts with slash
    const fromPath = data.from.startsWith('/') ? data.from : `/${data.from}`
    const toPath = data.to.startsWith('/') ? data.to : `/${data.to}`
    
    const redirection = await createRedirection({
      ...data,
      from: fromPath,
      to: toPath
    })
    
    return NextResponse.json(redirection, { status: 201 })
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A redirection with this "from" path already exists' }, 
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create redirection' }, 
      { status: 500 }
    )
  }
}