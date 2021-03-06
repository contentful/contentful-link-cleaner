import Promise from 'bluebird'
import log from 'npmlog'
import fs from 'fs'
Promise.promisifyAll(fs)

import {uniq} from 'lodash/array'
import {map, find} from 'lodash/collection'

import createClients from 'contentful-batch-libs/utils/create-clients'
import getSourceSpace from 'contentful-batch-libs/get/get-source-space'
import getOutdatedDestinationContent from 'contentful-batch-libs/get/get-outdated-destination-content'
import pushToSpace from 'contentful-batch-libs/push/push-to-space'
import {entries as entryTransformer} from 'contentful-batch-libs/transform/transformers'

import findEntryLinks from './find-entry-links'
import findMissingLinks from './find-missing-links'
import removeMissingLinksFromEntries from './remove-missing-links-from-entries'

import dumpErrorBuffer from './dump-error-buffer'

export default function runLinkCleaner (usage, publishEntries) {
  const {opts, errorLogFile} = usage
  const clients = createClients(opts)
  return getSourceSpace({
    deliveryClient: clients.source.delivery,
    managementClient: clients.source.management,
    sourceSpaceId: clients.source.spaceId,
    syncFromScratch: true,
    skipContentModel: true
  })

  .then(sourceResponse => {
    const entryLinks = findEntryLinks(sourceResponse.entries)
    const missingLinks = findMissingLinks(entryLinks, sourceResponse.entries, sourceResponse.assets)
    const entriesWithMissingLinks = uniq(map(missingLinks, ({entryId}) => entryId))

    return getOutdatedDestinationContent({
      managementClient: clients.source.management,
      spaceId: clients.source.spaceId,
      entryIds: entriesWithMissingLinks
    })
    .then(destinationResponse => {
      const transformedEntries = removeMissingLinksFromEntries(missingLinks, destinationResponse.entries)

      log.info(`Found ${missingLinks.length} broken links, which will be fixed.`)

      return pushToSpace({
        sourceContent: {
          entries: getOriginalAndTransformedEntries(sourceResponse.entries, transformedEntries)
        },
        destinationContent: {
          entries: destinationResponse.entries
        },
        managementClient: clients.source.management,
        spaceId: clients.source.spaceId,
        prePublishDelay: opts.prePublishDelay,
        skipContentModel: true,
        skipContentPublishing: !publishEntries
      })
      .then(() => {
        if (!publishEntries) {
          log.info('Remember: you chose not to have your entries republished.')
          log.info('Any entries with fixed links are now in draft state, with unpublished changes.')
          log.info('You can manually review and publish them.')
        }
        dumpErrorBuffer({
          destinationSpace: opts.destinationSpace,
          errorLogFile: errorLogFile
        }, 'However, additional errors were found')
      })
    })
  })

  // Output any errors caught along the way
  .catch(err => {
    dumpErrorBuffer({
      destinationSpace: opts.destinationSpace,
      errorLogFile: errorLogFile
    })
    throw err
  })
}

function getOriginalAndTransformedEntries (originalEntries, transformedEntries) {
  return map(transformedEntries, entry => {
    return {
      original: find(originalEntries, {sys: {id: entry.sys.id}}),
      transformed: entryTransformer(entry)
    }
  })
}
