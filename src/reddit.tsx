import React from '../lib/react';

export default function RedditPostViewer() {
  const [subreddit, setSubreddit] = React.useState('reactjs');
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=10`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.data.children.map(child => child.data));
      } catch (e) {
        setError('Failed to fetch posts. Please try again.');
        console.error('Fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [subreddit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubreddit = e.target.elements.subreddit.value;
    setSubreddit(newSubreddit);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Reddit Post Viewer</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            name="subreddit"
            defaultValue={subreddit}
            placeholder="Enter a subreddit"
            className="input input-bordered flex-grow"
          />
          <button type="submit" className="btn btn-primary">Fetch Posts</button>
        </form>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg my-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    {post.title}
                  </a>
                </h2>
                <p>Author: {post.author}</p>
                <p>Score: {post.score}</p>
                <p>Comments: {post.num_comments}</p>
                {post.thumbnail && post.thumbnail.startsWith('http') && (
                  <img src={post.thumbnail} alt="Post thumbnail" className="rounded-lg" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
