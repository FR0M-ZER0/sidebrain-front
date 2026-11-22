import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from './viteTestServer.mjs'

let server, toRankingDataset, RankingTable
const entry = (position) => ({
	position, userId: `u${position}`, name: `Estudante ${position}`,
	xp: 1000 - position, missionsCompleted: 0,
})

before(async () => {
	server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
	;({ toRankingDataset } = await server.ssrLoadModule('/src/api/rankingApi.ts'))
	;({ RankingTable } = await server.ssrLoadModule('/src/components/customer/ranking/RankingTable.tsx'))
})

after(async () => { await server?.close() })

const renderPage = (entries, page, totalItems) => {
	const dataset = toRankingDataset(entries, entry(1), {
		podiumEntries: [entry(1), entry(2), entry(3)],
		page,
		totalItems,
		totalPages: Math.ceil(totalItems / 10),
	})
	return renderToStaticMarkup(React.createElement(RankingTable, { dataset, onPageChange: () => {} }))
}

test('inclui os três primeiros na classificação e mostra a primeira página', () => {
	const html = renderPage(Array.from({ length: 10 }, (_, index) => entry(index + 1)), 1, 23)
	for (let position = 1; position <= 10; position += 1) {
		assert.match(html, new RegExp(`Estudante ${position}(?:<|")`))
	}
	assert.match(html, /Mostrando 1º ao 10º de 23 estudantes/)
	assert.match(html, /Página 1 de 3/)
	assert.match(html, /disabled=""[^>]*>.*Anterior/)
	assert.match(html, /Próxima/)
})

test('exibe corretamente a última página parcial', () => {
	const html = renderPage([entry(21), entry(22), entry(23)], 3, 23)
	assert.match(html, /Estudante 21/)
	assert.match(html, /Estudante 23/)
	assert.doesNotMatch(html, /Estudante 1(?:<|")/)
	assert.match(html, /Mostrando 21º ao 23º de 23 estudantes/)
	assert.match(html, /Página 3 de 3/)
	assert.match(html, /disabled=""[^>]*>Próxima/)
})

test('não exibe controles de paginação para uma página vazia', () => {
	const html = renderPage([], 1, 0)
	assert.match(html, /Nenhum estudante no ranking global/)
	assert.doesNotMatch(html, /Paginação do ranking/)
})
