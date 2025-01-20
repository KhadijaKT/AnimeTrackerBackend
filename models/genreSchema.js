const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    popularity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Genre', genreSchema);
  