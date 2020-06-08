const countLikes = (total, blog) => total + ((blog && blog.likes) || 0);
const mostOfSth = (blogs, reducer, key) => {
    const authors = blogs.reduce(reducer, {});
    const countOfSth = Math.max(...Object.values(authors));
    const firstRelevantAuthor = (() => {
        for (const author in authors) {
            if (authors[author] === countOfSth) return author;
        }
    })();
    return { author: firstRelevantAuthor, [key]: countOfSth };
};

module.exports = {
    dummy,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    totalLikes
};

function dummy() {
    return 1;
}

function favoriteBlog(blogs) {
    const favorite = { blog: null, likes: -Infinity };

    blogs.forEach(blog => {
        if (blog.likes > favorite.likes) {
            Object.assign(favorite, {
                blog,
                likes: blog.likes
            });
        }
    });

    return favorite.blog;
}

function mostBlogs(blogs) {
    return mostOfSth(blogs, (result, blog) => Object.assign(result, {
        [blog.author]: result[blog.author]
            ? result[blog.author] + 1
            : 1
    }), 'blogs');
}

function mostLikes(blogs) {
    return mostOfSth(blogs, (result, blog) => Object.assign(result, {
        [blog.author]: result[blog.author]
            ? result[blog.author] + blog.likes
            : blog.likes
    }), 'likes');
}

function totalLikes(blogs) {
    if (!Array.isArray(blogs)) return 0;
    return blogs.reduce(countLikes, 0);
}