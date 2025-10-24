import mongoose from 'mongoose'

const redirectionSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['301', '302'],
    default: '301'
  }
}, {
  timestamps: true
})

// Ensure from paths are case-insensitive and have consistent formatting
redirectionSchema.pre('save', function(next) {
  this.from = this.from.toLowerCase().trim()
  // Ensure from path starts with slash
  if (!this.from.startsWith('/')) {
    this.from = '/' + this.from
  }
  
  this.to = this.to.trim()
  // Ensure to path starts with slash
  if (!this.to.startsWith('/')) {
    this.to = '/' + this.to
  }
  next()
})

export default mongoose.models.Redirection || mongoose.model('Redirection', redirectionSchema)