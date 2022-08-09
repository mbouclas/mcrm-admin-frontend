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

    $: data = [];

    const server = {
        url: service.generateUrlForList(),
        headers: service.getAuthHeaders(),
        then: res => {
            return res.data.map(row => [
                html(`<a href='${row.uuid}'>${row.title}</a>`),
                row.sku,
                row.createdAt,
            ])
        },
        total: data => data.total
    };

    const pagination = {
        enabled: true,
        limit: 10,
        server: {
            url: (prev, page, limit) => {
                return `${prev}${prev.includes('?') ? '&' : '?'}limit=${limit}&page=${page+1}`;
            }
        }
    };

    const search = {
        server: {
            url: (prev, keyword) => {
                return `${prev}${prev.includes('?') ? '&' : '?'}q=${keyword}`;
            }
        }
    }

    const sort = {
        multiColumn: false,
        server: {
            url: (prev, columns) => {
                if (!columns.length) return prev;
                const col = columns[0];
                const dir = col.direction === 1 ? 'asc' : 'desc';
                let colName = ['title', 'sku'][col.index];


                return `${prev}${prev.includes('?') ? '&' : '?'}orderBy=${colName}&way=${dir}`;
            }
        }
    };

    onMount(async () => {

    });

    $: console.log(queryString.parse($location.search));
    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

    // Go to the service and get the products
    // We need a sidebar component to place the filters in


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
    ]

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

<Grid {data} {columns} {sort}
      {pagination}
      {search}
      {server}
       />




<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
