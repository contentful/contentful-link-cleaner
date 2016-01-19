import {filter, find} from 'lodash/collection'

/**
 * Finds which links from given list are not defined in existing entries and assets
 *
 * Returns array of filtered entryLinks
 */
export default function findMissingLinks (entryLinks, entries, assets) {
  return filter(entryLinks, entryLink => {
    let collection
    if (entryLink.link.sys.linkType === 'Entry') {
      collection = entries
    } else if (entryLink.link.sys.linkType === 'Asset') {
      collection = assets
    }

    return !find(collection, {sys: {id: entryLink.link.sys.id}})
  })
}
