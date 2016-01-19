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
        post: {locale: {sys: {id: '789', type: 'Link', linkType: 'Entry'}}}
      }
    }
  ]

  const entryLinks = findEntryLinks(entries)

  t.equal(entryLinks.length, 3)

  t.deepEqual(entryLinks[0].entryId, entries[0].sys.id, 'entry where first link was found')
  t.deepEqual(entryLinks[0].link, cloneDeep(entries[0].fields.image.locale), 'first link')
  t.deepEqual(entryLinks[0].path, 'image.locale', 'first link path')

  t.deepEqual(entryLinks[1].entryId, entries[0].sys.id, 'entry where second link was found')
  t.deepEqual(entryLinks[1].link, cloneDeep(entries[0].fields.article.locale), 'second link')
  t.deepEqual(entryLinks[1].path, 'article.locale', 'second link path')

  t.deepEqual(entryLinks[2].entryId, entries[1].sys.id, 'entry where third link was found')
  t.deepEqual(entryLinks[2].link, cloneDeep(entries[1].fields.post.locale), 'third link')
  t.deepEqual(entryLinks[2].path, 'post.locale', 'third link path')

  t.end()
})

test('Find 0 links in 0 entries', t => {
  const entryLinks = findEntryLinks([])
  t.equal(entryLinks.length, 0)
  t.end()
})
