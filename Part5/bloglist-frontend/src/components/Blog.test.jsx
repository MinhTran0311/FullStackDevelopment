import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
const blog = {
  id: '1',
  user: {
    id: 'user1',
    username: 'testuser',
    name: 'Test user',
  },
  likes: 5,
  author: 'Author Name',
  title: 'Blog Title',
  url: 'http://example.com'
}

test('renders title and author only', () => {
  render(<Blog blog={blog} isAuthor={true} updateBlog={() => {}} deleteBlog={() => {}} />)

  const titleAuthorElement = screen.getByText('Blog Title Author Name')
  expect(titleAuthorElement).toBeDefined()

  const urlElement = screen.queryByText('http://example.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes: 5')
  expect(likesElement).toBeNull()
})

test('shows URL and number of likes when the button is clicked', async () => {
  render(<Blog blog={blog} isAuthor={true} updateBlog={() => {}} deleteBlog={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('url: http://example.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes: 5')
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} isAuthor={true} updateBlog={mockHandler} deleteBlog={() => {}} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})