const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['Watching', 'Completed', 'Plan to Watch'], 
      required: true 
    },
    animeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
  });
  
  module.exports = mongoose.model('Watchlist', watchlistSchema);
  