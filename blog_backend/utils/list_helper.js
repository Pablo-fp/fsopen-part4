const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.lenght === 0) return 0;
  if (blogs.lenght === 1) return blog.likes;
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite;
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
