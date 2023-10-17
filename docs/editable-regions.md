## Building the regions

* Add region, just title, description and some metadata. Button to add groups
* add group button -> show modal with available components and add a title for said group. For example, title slide, type repeater has 3 Custom fields
label, text, image

## Filling the regions with content

* Groups can be repeaters, groups or executors. A group is the same as a repeater just not "repeatable"
* An executor is selected from the list of available executors which is taken from registered decorators
* Select region
* Select group, e.g. slider
* Shows the fields rendered. If repeater there's a + button to add a new row
* Saves as json string on the client-config

## Custom Fields

* Native fields like input, email etc
* Relational, using the item selector from the available configs `itemSelectorConfigs`
* Image
* File
* Rich Text
* Markdown
* Executor, get a list from the decorators


## Format of the region
```
{
    name: 'home',
    label: 'Homepage',
    description: 'This is the homepage',

    regions: [
        {SliderRegion},
        {TextRegion},
        {LatestProductsRegion},
    ]
}
```

## Format for repeater or group
```
{
    name: 'slider',
    label: 'Slider',
    type: 'repeater', // or group
    settings: {
        limit: 5
    },
    fields: [
        {
            name: 'product',
            label: 'Product',
            type: 'relational',
            allowedTypes: ['Product'],
            settings: {
                limit: 1,
                reconstructModels: true,
            },
        },
        {
            name: 'select',
            label: 'Select',
            type: 'select',
            options: [
                {
                    label: 'Option 1',
                    value: 'option-1',
                    default: true
                },
                {
                    label: 'Option 2',
                    value: 'option-2',
                }
            ]
        },
        {
            name: 'title',
            label: 'Title',
            type: 'text',
        },
        {
            name: 'text',
            label: 'Text',
            type: 'rich-text',
        },
        {
            name: 'image',
            label: 'Image',
            type: 'image',
            options: {},
            metaData: {},
        }
    ],
}
```

## Format of executor region
```
{
    name: 'latest-products',
    label: 'Latest Products',
    type: 'class',
    executor: 'LatestProductsExecutor',
    regionSettings: {
      limit: 5,
    }
}
```
