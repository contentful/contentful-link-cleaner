import {each} from 'lodash/collection'
import {isPlainObject} from 'lodash/lang'

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
            path: fieldId + '.' + localeId
          })
        }
      })
    })
  })
  return entryLinks
}
