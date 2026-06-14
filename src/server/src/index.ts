import { Hono } from 'hono'

const app = new Hono()

app.get('/chat', (c) => {
  return c.text('Hello Hono!')
})

app.get('/stop', (c) => {
  
}

export default app
