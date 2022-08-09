<script>
    import queryString from "query-string";
    import { useParams, useLocation } from "svelte-navigator";
    import {ProductsService} from "../services/products/products.service.ts";
    import {onMount} from "svelte";
    import Grid from "gridjs-svelte"
    import {html} from "gridjs";
    const service = new ProductsService();
    const params = useParams();
    const location = useLocation();
    const filters = {};
    let gridInstance;
    $: data = [];

    const server = service.getGridUrl(filters);
    const pagination = service.getGridPaginationObject();
    const search = service.getGridSearchObject();
    const sort = service.getGridSortObject(['title', 'sku']);
    const columns = [
           {
                  name: 'Title',
                  id: 'title',
           },
           {
                  name: 'Sku',
                  id: 'sku',
           },
           {
                  name: 'Date',
                  id: 'createdAt',
                  formatter: cell => {
                         return new Date(cell).toLocaleString('el-EL', {
                                month: 'short',
                                year: 'numeric'
                         })
                  }
           }
    ];

    onMount(async () => {

    });

    $: console.log(queryString.parse($location.search));
    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

    // Go to the service and get the products
    // We need a sidebar component to place the filters in




    // gridInstance.on('rowClick', (...args) => console.log('row: ' + JSON.stringify(args), args));

    function handleRowClick(...args) {
           console.log('row: ' + JSON.stringify(args), args)
    }

    function handleCellClick(...args) {
           console.log('cell: ' + JSON.stringify(args), args)
    }

</script>

<h1>Product List 12</h1>

<Grid {data} {columns} {sort} bind:instance={gridInstance}
      {pagination}
      {search}
      {server}
      on:rowClick={handleRowClick}
      on:cellClick={handleCellClick}
       />




<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
