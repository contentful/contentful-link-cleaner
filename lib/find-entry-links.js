import {each} from 'lodash/collection'
import {get} from 'lodash/object'
import {isPlainObject, isArray} from 'lodash/lang'

/**
 * Finds entry links
 *
 * returns array of entryLinks
 */
export default function findEntryLinks (entries) {
  const entryLinks = []
  each(entries, entry => {
    each(entry.fields, (field, fieldId) => {
      each(field, (locale, localeId) => {
        if (isPlainObject(locale) && locale.sys.type === 'Link') {
          entryLinks.push({
            entryId: entry.sys.id,
            link: locale,
            path: `${fieldId}.${localeId}`,
            type: 'Single'
          })
        } else if (isArray(locale) && get(locale[0], 'sys.type') === 'Link') {
          each(locale, (listItem, index) => {
            entryLinks.push({
              entryId: entry.sys.id,
              link: listItem,
              path: `${fieldId}.${localeId}`,
              type: 'Array'
            })
          })
        }
      })
    })
  })
  return entryLinks
}
