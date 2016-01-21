# Contentful Link Cleaner

This tool cleans up unresolved Entry links in Contentful spaces.

When you have a link to an Entry or Asset on a Published Entry, if you delete the linked Entry the Entry that links to it will have a reference to a non existing entity.

This tool goes through all of your entries, figures out which links don't exist anymore, and removes them.

This might be particularly relevant to users of [contentful-space-sync](https://github.com/contentful/contentful-space-sync).

If you're not entirely clear on what Links are, check out the [Links page](https://www.contentful.com/developers/docs/concepts/links/) for more information.

This tool will ask you if the entries which have had their links fixed should also be published. This is the default, and we recommend that we do.

Any entries that don't get their links fixed will stay in "updated" state and will need to be published manually.

# Changelog

Check out the [releases](https://github.com/contentful/contentful-link-cleaner/releases) page.

# Install

`npm install -g contentful-link-cleaner`

# Usage

```
Usage: contentful-link-cleaner [options]

Options:
  --version                       Show version number

  --space                         ID of Space with source data
                                  [string] [required]

  --destination-space             ID of Space data will be copied to
                                  [string] [required]

  --delivery-token                Delivery API token
                                  [string] [required]

  --management-token              Management API token
                                  [string]

  --pre-publish-delay             Delay in milliseconds to account for delay
                                  after creating entities, due to internal
                                  database indexing
                                  [default: 5000]

  --config                        Configuration file with required values

```

Check the `example-config.json` file for an example of what a configuration file would look like. If you use the config file, you don't need to specify the other options for tokens and space ids.

# Example usage

```
contentful-link-cleaner \
  --space sourceSpaceId \
  --delivery-token spaceDeliveryToken \
  --management-token spaceManagementToken
```

or

```
contentful-link-cleaner --config example-config.json
```

You can create your own config file based on the [`example-config.json`](example-config.json) file.
