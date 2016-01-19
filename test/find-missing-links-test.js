import test from 'tape'

import findMissingLinks from '../lib/find-missing-links'

test('Find 2 missing links', t => {
  const entries = [
    { sys: {id: 'link1', type: 'Entry'} },
    { sys: {id: 'link2', type: 'Entry'} }
  ]

  const assets = [
    { sys: {id: 'link1', type: 'Asset'} },
    { sys: {id: 'link3', type: 'Asset'} }
  ]

  const entryLinks = [
    {
      entry: {sys: {id: 'entry1'}},
      link: {sys: {id: 'link1', type: 'Link', linkType: 'Asset'}},
      path: 'link1.path'
    },
    {
      entry: {sys: {id: 'entry1'}},
      link: {sys: {id: 'link2', type: 'Link', linkType: 'Entry'}},
      path: 'link2.path'
    },
    {
      entry: {sys: {id: 'entry2'}},
      link: {sys: {id: 'link3', type: 'Link', linkType: 'Entry'}},
      path: 'link3.path'
    },
    {
      entry: {sys: {id: 'entry2'}},
      link: {sys: {id: 'link4', type: 'Link', linkType: 'Asset'}},
      path: 'link4.path'
    }
  ]

  const missingLinks = findMissingLinks(entryLinks, entries, assets)

  t.equal(missingLinks.length, 2)

  t.deepEqual(missingLinks[0], entryLinks[2], 'finds first missing link')
  t.deepEqual(missingLinks[1], entryLinks[3], 'finds second missing link')

  t.end()
})

test('Find no missing links', t => {
  const entries = [
    { sys: {id: 'link1', type: 'Entry'} },
    { sys: {id: 'link2', type: 'Entry'} }
  ]

  const assets = [
    { sys: {id: 'link1', type: 'Asset'} },
    { sys: {id: 'link3', type: 'Asset'} }
  ]

  const entryLinks = [
    {
      entry: {sys: {id: 'entry1'}},
      link: {sys: {id: 'link1', type: 'Link', linkType: 'Asset'}},
      path: 'link1.path'
    },
    {
      entry: {sys: {id: 'entry1'}},
      link: {sys: {id: 'link1', type: 'Link', linkType: 'Entry'}},
      path: 'link2.path'
    },
    {
      entry: {sys: {id: 'entry2'}},
      link: {sys: {id: 'link2', type: 'Link', linkType: 'Entry'}},
      path: 'link3.path'
    },
    {
      entry: {sys: {id: 'entry2'}},
      link: {sys: {id: 'link3', type: 'Link', linkType: 'Asset'}},
      path: 'link4.path'
    }
  ]

  const missingLinks = findMissingLinks(entryLinks, entries, assets)

  t.equal(missingLinks.length, 0)
  t.end()
})
