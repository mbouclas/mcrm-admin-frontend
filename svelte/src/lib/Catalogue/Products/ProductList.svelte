<script>
    import queryString from "query-string";
    import { useParams, useLocation } from "svelte-navigator";
    import {ProductsService} from "../services/products/products.service.ts";

    import Grid from '../../Shared/AgGrid.svelte'
    const params = useParams();
    const location = useLocation();


    $: console.log(queryString.parse($location.search));
    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

    // Go to the service and get the products
    // We need a sidebar component to place the filters in

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
</script>

<h1>Product List 12</h1>
<Grid bind:data {columnDefs} theme="alpine-dark"
      on:select={onSelect}
      on:ready={onGridReady}
      on:update={onCellUpdated}
/>
