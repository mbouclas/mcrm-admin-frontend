<script>
    import queryString from "query-string";
    import { useParams, useLocation } from "svelte-navigator";
    import {ProductsService} from "../services/products/products.service.ts";
    import {onMount} from "svelte";
    const service = new ProductsService();
    const params = useParams();
    const location = useLocation();
    let data = [];

    onMount(async () => {
        await fetchProducts();
    });

    $: console.log(queryString.parse($location.search));
    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

    // Go to the service and get the products
    // We need a sidebar component to place the filters in



    async function fetchProducts() {
        const relationships = ['variants', 'properties'];
        const res = await service.find({'with[]': relationships});
        $: data = res.data;
        return res;
    }

    const columns = [
        {
            name: 'Title',
            sort: true
        },
        {
            name: 'Sku',
            sort: false
        },
        {
            name: 'Date',
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

