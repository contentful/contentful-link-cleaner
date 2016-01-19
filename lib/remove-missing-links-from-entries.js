import {each, map, find} from 'lodash/collection'
import {keys, has} from 'lodash/object'

/**
 * Modifies entries to remove missing links
 *
 * Returns modified entry objects without missing links.
 * Also deduplicates modified entries as multiple missing links can occur
 * in the same entry.
 */
export default function removeMissingLinksFromEntries (missingLinks, sourceEntries) {
  const modifiedEntries = {}

  each(missingLinks, ({entryId, link, path}) => {
    const entryToModify = entryId in modifiedEntries
                          ? modifiedEntries[entryId]
                          : find(sourceEntries, {sys: {id: entryId}})

    if (has(entryToModify.fields, path)) {
      const [fieldId, localeId] = path.split('.')
      // remove missing link from locale in field
      delete entryToModify.fields[fieldId][localeId]
      // if there are no more locales in the field, remove the whole field
      if (keys(entryToModify.fields[fieldId]).length === 0) {
        delete entryToModify.fields[fieldId]
      }
    }

    modifiedEntries[entryId] = entryToModify
  })

  return map(modifiedEntries, entry => entry)
}
