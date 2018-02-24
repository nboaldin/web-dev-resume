const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
