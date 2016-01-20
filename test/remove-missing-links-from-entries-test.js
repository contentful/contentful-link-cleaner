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
        field3: {en: {sys: {id: 'link3', type: 'Link', linkType: 'Entry'}}, fr: ''},
        field4: {en: [
          {sys: {id: 'link4', type: 'Link', linkType: 'Entry'}},
          {sys: {id: 'link5', type: 'Link', linkType: 'Entry'}}
        ]},
        field5: {en: [
          {sys: {id: 'link6', type: 'Link', linkType: 'Entry'}}
        ]}
      }
    }
  ]

  const missingLinks = [
    {
      entryId: entries[0].sys.id,
      link: {sys: {id: 'link1', type: 'Link', linkType: 'Asset'}},
      path: 'field1.en',
      type: 'Single'
    },
    {
      entryId: entries[0].sys.id,
      link: {sys: {id: 'link2', type: 'Link', linkType: 'Entry'}},
      path: 'field2.en',
      type: 'Single'
    },
    {
      entryId: entries[1].sys.id,
      link: {sys: {id: 'link3', type: 'Link', linkType: 'Entry'}},
      path: 'field3.en',
      type: 'Single'
    },
    {
      entryId: entries[1].sys.id,
      link: {sys: {id: 'link4', type: 'Link', linkType: 'Entry'}},
      path: 'field4.en[0]',
      type: 'Array'
    },
    {
      entryId: entries[1].sys.id,
      link: {sys: {id: 'link6', type: 'Link', linkType: 'Entry'}},
      path: 'field5.en[0]',
      type: 'Array'
    }
  ]

  const expectedEntries = cloneDeep(entries)
  delete expectedEntries[0].fields.field1.en
  delete expectedEntries[0].fields.field2
  delete expectedEntries[1].fields.field3.en
  expectedEntries[1].fields.field4.en.splice(0, 1)
  delete expectedEntries[1].fields.field5

  const modifiedEntries = removeMissingLinksFromEntries(missingLinks, cloneDeep(entries))

  t.equal(modifiedEntries.length, 2)

  t.deepEqual(modifiedEntries[0], expectedEntries[0], 'removes links from first entry')
  t.deepEqual(modifiedEntries[1], expectedEntries[1], 'removes links from second entry')

  t.end()
})
