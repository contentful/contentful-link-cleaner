import test from 'tape'
import {cloneDeep} from 'lodash/lang'

import removeMissingLinksFromEntries from '../lib/remove-missing-links-from-entries'

test('Remove 3 missing links', t => {
  const entries = [
    {
      sys: {id: 'entry1'},
      fields: {
        field0: {en: 'name'},
        field1: {en: {sys: {id: 'link1', type: 'Link', linkType: 'Asset'}}, fr: ''},
        field2: {en: {sys: {id: 'link2', type: 'Link', linkType: 'Entry'}}}
      }
    },
    {
      sys: {id: 'entry2'},
      fields: {
        field3: {en: {sys: {id: 'link3', type: 'Link', linkType: 'Entry'}}, fr: ''}
      }
    }
  ]

  const missingLinks = [
    {
      entryId: entries[0].sys.id,
      link: {sys: {id: 'link1', type: 'Link', linkType: 'Asset'}},
      path: 'field1.en'
    },
    {
      entryId: entries[0].sys.id,
      link: {sys: {id: 'link2', type: 'Link', linkType: 'Entry'}},
      path: 'field2.en'
    },
    {
      entryId: entries[1].sys.id,
      link: {sys: {id: 'link3', type: 'Link', linkType: 'Entry'}},
      path: 'field3.en'
    }
  ]

  const expectedEntries = cloneDeep(entries)
  delete expectedEntries[0].fields.field1.en
  delete expectedEntries[0].fields.field2
  delete expectedEntries[1].fields.field3.en

  const modifiedEntries = removeMissingLinksFromEntries(missingLinks, cloneDeep(entries))

  t.equal(modifiedEntries.length, 2)

  t.deepEqual(modifiedEntries[0], expectedEntries[0], 'removes links from first entry')
  t.deepEqual(modifiedEntries[1], expectedEntries[1], 'removes links from second entry')

  t.end()
})
