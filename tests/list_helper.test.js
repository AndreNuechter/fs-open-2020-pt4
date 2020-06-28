const listHelper = require('../utils/list_helper');
const { randomArrayIndex, randomArraySubset } = require('./test_helper');
const testBlogs = require('./test-blogs');

test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});

describe('totalLikes', () => {
    const listWithOneBlog = {
        blog: [testBlogs[randomArrayIndex(testBlogs)]],
        get likes() { return this.blog[0].likes; }
    };

    test('for a single random blog, returns the likes of that', () => {
        expect(listHelper.totalLikes(listWithOneBlog.blog))
            .toBe(listWithOneBlog.likes);
    });

    const listWithSubsetOfBlogs = {
        blogs: randomArraySubset(testBlogs),
        get likes() { return this.blogs.reduce((total, blog) => total + Number(blog.likes), 0); }
    };

    test('for a random subset of blogs, returns the likes of that', () => {
        expect(listHelper.totalLikes(listWithSubsetOfBlogs.blogs))
            .toBe(listWithSubsetOfBlogs.likes);
    });

    test('returns zero for invalid inputs', () => {
        expect(listHelper.totalLikes(12))
            .toBe(0);
        expect(listHelper.totalLikes([]))
            .toBe(0);
        expect(listHelper.totalLikes())
            .toBe(0);
        expect(listHelper.totalLikes('foo'))
            .toBe(0);
    });

    test('only counts array elements that have the like property', () => {
        expect(listHelper.totalLikes([{ likes: 42 }, false, undefined, true, 0, 'foo', [NaN]]))
            .toBe(42);
    });
});

describe('favoriteBlog', () => {
    const mockBlog = { likes: Infinity };

    test('returns the blog with the most likes', () => {
        expect(listHelper.favoriteBlog(testBlogs).likes).toBe(12);
        expect(listHelper.favoriteBlog([...testBlogs, mockBlog])).toBe(mockBlog);
        expect(listHelper.favoriteBlog([mockBlog, ...testBlogs])).toBe(mockBlog);
    });
});

describe('mostBlogs', () => {
    test('returns the author of the most blogs incl the number of blogs', () => {
        expect(listHelper.mostBlogs(testBlogs)).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        });
    });
});

describe('mostBlogs', () => {
    test('returns the author with the most likes incl the number of likes', () => {
        expect(listHelper.mostLikes(testBlogs)).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        });
    });
});