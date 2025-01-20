const ratingReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    rating: { type: Number, min: 0, max: 10 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('RatingReview', ratingReviewSchema);
  