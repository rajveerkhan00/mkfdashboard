import { NextResponse } from 'next/server'
import { getRedirectionById, updateRedirection, deleteRedirection } from '@/lib/redirections'

export async function GET(request, { params }) {
  try {
    const redirection = await getRedirectionById(params.id)
    
    if (!redirection) {
      return NextResponse.json(
        { error: 'Redirection not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(redirection)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch redirection' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
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
    
    const redirection = await updateRedirection(params.id, {
      ...data,
      from: fromPath,
      to: toPath
    })
    
    return NextResponse.json(redirection)
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A redirection with this "from" path already exists' }, 
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update redirection' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteRedirection(params.id)
    return NextResponse.json({ message: 'Redirection deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete redirection' }, 
      { status: 500 }
    )
  }
}