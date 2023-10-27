<script lang="ts">
    import OrdersListWidget from "../Order/Order/widgets/orders-list.svelte";
    import LatestCustomers from "../Customer/widgets/latest-customers.svelte";
    import StoreStatistics from "./widgets/store-statistics.svelte";
    import StorePerformance from "./widgets/store-performance.svelte";
</script>
<div class="my-4">
    <StorePerformance />
</div>


<div class="my-4">
    <OrdersListWidget limit={5} />
</div>

<div class="my-4">
    <StoreStatistics />
</div>

<div class="my-4">

    <LatestCustomers limit={5} />

</div>
