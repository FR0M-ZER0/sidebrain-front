import assert from 'node:assert/strict'
import { createServer as createHttpServer } from 'node:http'
import { after, before, test } from 'node:test'
import { createServer } from './viteTestServer.mjs'

let vite, http, api, mentor, port, quizApi, getQuizMentorContext
const requests = []
before(async () => {
 vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
 ;({ api } = await vite.ssrLoadModule('/src/api/api.ts'))
  mentor = await vite.ssrLoadModule('/src/api/mentorApi.ts')
  quizApi = await vite.ssrLoadModule('/src/api/quizApi.ts')
  ;({ getQuizMentorContext } = await vite.ssrLoadModule('/src/components/customer/mentor/mentorContext.ts'))
 http = createHttpServer((req, res) => {
  let body = ''
  req.on('data', (part) => { body += part })
  req.on('end', () => {
   requests.push({ url: req.url, method: req.method, headers: req.headers, body })
   if (req.url.endsWith('/events')) {
    res.writeHead(200, { 'Content-Type': 'text/event-stream' })
    res.write(': keep-alive\r\nevent: generation\r\ndata: {"generation":{"id":"gen","status":"processing"},"message":null}\r\n\r\n')
    res.end('event: generation\ndata: {"generation":{"id":"gen","status":"completed"},"message":{"id":"msg","content":"Olá"}}\n\n')
    } else if (req.url.endsWith('/answers')) {
     res.writeHead(201, { 'Content-Type': 'application/json' })
     res.end('{"id":"answer-1","rate":"almost_got_it","reason":"Faltou detalhe."}')
    } else { res.writeHead(202, { 'Content-Type': 'application/json' }); res.end('{"generation_id":"gen","message_id":"msg","status":"queued"}') }
  })
 })
 await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve))
 port = http.address().port
 api.defaults.baseURL = `http://127.0.0.1:${port}`
 const auth = await vite.ssrLoadModule('/src/api/api.ts')
 auth.setApiAccessToken('token-de-teste')
})
after(async () => { await vite?.close(); await new Promise((resolve) => http?.close(resolve)) })

test('envia mensagem autenticada com chave de idempotência e conteúdo', async () => {
 await mentor.sendMentorMessage('conversa', 'Pergunta', 'chave')
 const req = requests.at(-1)
 assert.equal(req.url, '/api/v1/mentor-conversations/conversa/messages')
 assert.equal(req.headers.authorization, 'Bearer token-de-teste')
 assert.equal(req.headers['idempotency-key'], 'chave')
 assert.deepEqual(JSON.parse(req.body), { content: 'Pergunta' })
})

test('envia os identificadores do contexto e mantém a tentativa avaliada', async () => {
 const evaluation = await quizApi.submitLessonQuizAnswer('question-1', 'Minha resposta')
 assert.deepEqual(evaluation, { id: 'answer-1', rate: 'almost_got_it', reason: 'Faltou detalhe.' })
 const context = { type: 'quiz', lesson_id: 'lesson-1', quiz_id: 'question-1', answer_id: evaluation.id }
 await mentor.sendMentorMessage('conversa', 'Por que quase certa?', 'chave', context)
 const req = requests.at(-1)
 assert.deepEqual(JSON.parse(req.body), { content: 'Por que quase certa?', context })
})

test('usa apenas a questão visível e a avaliação da tentativa atual', () => {
 const lesson = { id: 'lesson-1', title: 'Listas' }
 const first = { id: 'q1', lessonId: 'lesson-1', question: 'Pergunta 1' }
 const second = { id: 'q2', lessonId: 'lesson-1', question: 'Pergunta 2' }
 const evaluation = { id: 'answer-1', rate: 'wrong', reason: 'Motivo' }
 assert.deepEqual(getQuizMentorContext(lesson, 'lesson-1', first, null, 0, 2), {
  screen: { type: 'quiz', lesson_id: 'lesson-1', quiz_id: 'q1' },
  lessonTitle: 'Listas', questionNumber: 1, questionCount: 2,
 })
 assert.equal(getQuizMentorContext(lesson, 'lesson-1', first, evaluation, 0, 2).screen.answer_id, 'answer-1')
 assert.deepEqual(getQuizMentorContext(lesson, 'lesson-1', second, null, 1, 2).screen, {
  type: 'quiz', lesson_id: 'lesson-1', quiz_id: 'q2',
 })
 assert.equal(getQuizMentorContext(lesson, 'lesson-2', first, null, 0, 2), undefined)
})

test('acompanha eventos SSE autenticados até a resposta completa', async () => {
 const events = []
 await mentor.streamMentorGeneration('conversa', 'gen', new AbortController().signal, (event) => events.push(event))
 assert.deepEqual(events.map((event) => event.generation.status), ['processing', 'completed'])
 assert.equal(events[1].message.content, 'Olá')
 assert.equal(requests.at(-1).headers.authorization, 'Bearer token-de-teste')
 assert.equal(requests.at(-1).headers.accept, 'text/event-stream')
})
