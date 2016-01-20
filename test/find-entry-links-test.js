import test from 'tape'
import {cloneDeep} from 'lodash/lang'

import findEntryLinks from '../lib/find-entry-links'

test('Find 3 links in 2 entries', t => {
  const entries = [
    {
      sys: {},
      fields: {
        name: {locale: 'name'},
        image: {locale: {sys: {id: '123', type: 'Link', linkType: 'Asset'}}},
        article: {locale: {sys: {id: '456', type: 'Link', linkType: 'Entry'}}}
      }
    },
    {
      sys: {},
      fields: {
        name: {locale: 'name'},
        post: {locale: {sys: {id: '789', type: 'Link', linkType: 'Entry'}}},
        tags: {
          locale: [
            {sys: {id: 'tag1', type: 'Link', linkType: 'Entry'}},
            {sys: {id: 'tag2', type: 'Link', linkType: 'Entry'}}
          ]
        }
      }
    }
  ]

  const entryLinks = findEntryLinks(entries)

  t.equal(entryLinks.length, 5)

  t.deepEqual(entryLinks[0].entryId, entries[0].sys.id, 'entry where first link was found')
  t.deepEqual(entryLinks[0].link, cloneDeep(entries[0].fields.image.locale), 'first link')
  t.equals(entryLinks[0].path, 'image.locale', 'first link path')
  t.equals(entryLinks[0].type, 'Single', 'first link type')

  t.deepEqual(entryLinks[1].entryId, entries[0].sys.id, 'entry where second link was found')
  t.deepEqual(entryLinks[1].link, cloneDeep(entries[0].fields.article.locale), 'second link')
  t.equals(entryLinks[1].path, 'article.locale', 'second link path')
  t.equals(entryLinks[1].type, 'Single', 'second link type')

  t.deepEqual(entryLinks[2].entryId, entries[1].sys.id, 'entry where third link was found')
  t.deepEqual(entryLinks[2].link, cloneDeep(entries[1].fields.post.locale), 'third link')
  t.equals(entryLinks[2].path, 'post.locale', 'third link path')
  t.equals(entryLinks[2].type, 'Single', 'third link type')

  t.deepEqual(entryLinks[3].entryId, entries[1].sys.id, 'entry where fourth link was found')
  t.deepEqual(entryLinks[3].link, cloneDeep(entries[1].fields.tags.locale[0]), 'fourth link')
  t.equals(entryLinks[3].path, 'tags.locale[0]', 'fourth link path')
  t.equals(entryLinks[3].type, 'Array', 'fourth link type')

  t.deepEqual(entryLinks[4].entryId, entries[1].sys.id, 'entry where fifth link was found')
  t.deepEqual(entryLinks[4].link, cloneDeep(entries[1].fields.tags.locale[1]), 'fifth link')
  t.equals(entryLinks[4].path, 'tags.locale[1]', 'fifth link path')
  t.equals(entryLinks[4].type, 'Array', 'fifth link type')

  t.end()
})

test('Find 0 links in 0 entries', t => {
  const entryLinks = findEntryLinks([])
  t.equal(entryLinks.length, 0)
  t.end()
})
