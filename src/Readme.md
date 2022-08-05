# Grid
`import Grid from '@shared/AgGrid.svelte'`
### Setup
```
    let data = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 },
    ];

    let columnDefs = [
        {
            headerName: "Make",
            field: "make",
            sortable: true,
            editable: true,
        },
        { headerName: "Model", field: "model", sortable: true },
        { headerName: "Price", field: "price", sortable: true },
    ];
```

### Markup
```
<Grid bind:data {columnDefs} theme="alpine-dark"
      on:select={onSelect}
      on:ready={onGridReady}
      on:update={onCellUpdated}
/>
```

#### Events
```
function onSelect(event) {
        const rows = event.detail
        console.log(rows)
    }

    function onGridReady() {
        console.log('Grid is ready')
    }

    function onCellUpdated(event) {
        const data = event.detail.data;
        const idx = event.detail.row;
        console.log(data, idx)
    }
```

