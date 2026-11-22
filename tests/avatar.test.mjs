import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server, api, originalAdapter, getAvatars, updateCurrentUser
let getAvatarImageUrl, toRankingDataset, RankingPodium, RankingTable

const cat = { slug: 'cat', name: 'Gato', imageUrl: '/static/avatars/cat.png' }

before(async () => {
	server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	originalAdapter = api.defaults.adapter
	;({ getAvatars } = await server.ssrLoadModule('/src/api/avatarApi.ts'))
	;({ updateCurrentUser } = await server.ssrLoadModule('/src/api/auth.ts'))
	;({ getAvatarImageUrl } = await server.ssrLoadModule('/src/util/avatar.ts'))
	;({ toRankingDataset } = await server.ssrLoadModule('/src/api/rankingApi.ts'))
	;({ RankingPodium } = await server.ssrLoadModule('/src/components/customer/ranking/RankingPodium.tsx'))
	;({ RankingTable } = await server.ssrLoadModule('/src/components/customer/ranking/RankingTable.tsx'))
})

after(async () => {
	api.defaults.adapter = originalAdapter
	await server?.close()
})

test('carrega catálogo e atualiza ou remove o avatar pelo slug', async () => {
	const requests = []
	api.defaults.adapter = async (config) => {
		requests.push(config)
		return {
			data: config.method === 'get' ? { data: [cat] } : { id: 'u1', avatar: cat },
			status: 200, statusText: 'OK', headers: {}, config,
		}
	}
	assert.deepEqual(await getAvatars(), [cat])
	await updateCurrentUser({ name: 'Ana', avatar: 'cat' })
	await updateCurrentUser({ avatar: null })
	await updateCurrentUser({ name: 'Ana' })
	assert.equal(requests[0].url, '/api/v1/avatars')
	assert.deepEqual(JSON.parse(requests[1].data), { name: 'Ana', avatar: 'cat' })
	assert.deepEqual(JSON.parse(requests[2].data), { avatar: null })
	assert.deepEqual(JSON.parse(requests[3].data), { name: 'Ana' })
})

test('resolve imagens relativas na origem do backend', () => {
	assert.equal(getAvatarImageUrl(cat.imageUrl, 'https://api.example.test/api/v1'), 'https://api.example.test/static/avatars/cat.png')
	assert.equal(getAvatarImageUrl(cat.imageUrl, ''), cat.imageUrl)
	assert.equal(getAvatarImageUrl('https://cdn.example.test/avatar.png', 'https://api.example.test'), 'https://cdn.example.test/avatar.png')
})

test('exibe o avatar do ranking no pódio e na tabela', () => {
	const entries = [1, 2, 3, 4].map((position) => ({
		position, userId: `u${position}`, name: `Aluno ${position}`,
		xp: 100 - position, missionsCompleted: 0, avatar: cat,
	}))
	const dataset = toRankingDataset(entries, entries[3])
	assert.equal(dataset.participants[3].avatar, cat.imageUrl)
	const podium = renderToStaticMarkup(React.createElement(RankingPodium, { participants: dataset.podium, scoreLabel: 'XP' }))
	const table = renderToStaticMarkup(React.createElement(RankingTable, { dataset, onPageChange: () => {} }))
	assert.match(podium, /static\/avatars\/cat\.png/)
	assert.match(table, /static\/avatars\/cat\.png/)
	assert.match(table, /Avatar de Aluno 4/)
})
