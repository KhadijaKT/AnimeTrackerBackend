const animeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: [String], required: true },
    status: { 
      type: String, 
      enum: ['Watching', 'Completed', 'Plan to Watch'], 
      required: true 
    },
    rating: { type: Number, min: 0, max: 10 },
    review: { type: String },
    progress: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Anime', animeSchema);
  