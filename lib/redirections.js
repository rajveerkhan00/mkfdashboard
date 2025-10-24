import Redirection from '@/models/Redirection'
import { connectDB } from '@/lib/db'

export async function getRedirections() {
  try {
    await connectDB()
    const redirections = await Redirection.find({}).sort({ updatedAt: -1 })
    
    return redirections.map(redir => ({
      id: redir._id.toString(),
      from: redir.from,
      to: redir.to,
      type: redir.type,
      createdAt: redir.createdAt,
      updatedAt: redir.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching redirections:', error)
    return []
  }
}

export async function getRedirectionById(id) {
  try {
    await connectDB()
    const redirection = await Redirection.findById(id)
    
    if (!redirection) return null
    
    return {
      id: redirection._id.toString(),
      from: redirection.from,
      to: redirection.to,
      type: redirection.type,
      createdAt: redirection.createdAt,
      updatedAt: redirection.updatedAt
    }
  } catch (error) {
    console.error('Error fetching redirection:', error)
    return null
  }
}

export async function createRedirection(data) {
  try {
    await connectDB()
    
    // Format paths
    const fromPath = data.from.startsWith('/') ? data.from.toLowerCase() : `/${data.from.toLowerCase()}`
    const toPath = data.to.startsWith('/') ? data.to : `/${data.to}`
    
    const redirection = new Redirection({
      from: fromPath,
      to: toPath,
      type: data.type
    })
    
    await redirection.save()
    
    return {
      id: redirection._id.toString(),
      from: redirection.from,
      to: redirection.to,
      type: redirection.type,
      createdAt: redirection.createdAt,
      updatedAt: redirection.updatedAt
    }
  } catch (error) {
    console.error('Error creating redirection:', error)
    throw error
  }
}

export async function updateRedirection(id, data) {
  try {
    await connectDB()
    
    // Format paths
    const fromPath = data.from.startsWith('/') ? data.from.toLowerCase() : `/${data.from.toLowerCase()}`
    const toPath = data.to.startsWith('/') ? data.to : `/${data.to}`
    
    const redirection = await Redirection.findByIdAndUpdate(
      id,
      {
        from: fromPath,
        to: toPath,
        type: data.type
      },
      { new: true, runValidators: true }
    )
    
    if (!redirection) {
      throw new Error('Redirection not found')
    }
    
    return {
      id: redirection._id.toString(),
      from: redirection.from,
      to: redirection.to,
      type: redirection.type,
      createdAt: redirection.createdAt,
      updatedAt: redirection.updatedAt
    }
  } catch (error) {
    console.error('Error updating redirection:', error)
    throw error
  }
}

export async function deleteRedirection(id) {
  try {
    await connectDB()
    
    const redirection = await Redirection.findByIdAndDelete(id)
    
    if (!redirection) {
      throw new Error('Redirection not found')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting redirection:', error)
    throw error
  }
}