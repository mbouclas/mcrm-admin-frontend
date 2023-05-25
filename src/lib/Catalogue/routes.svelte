<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Product from "./Products/Product.svelte";
  import ProductList from "./Products/ProductList.svelte";
  import ProductCategoriesList from "./Products/ProductCategoriesList.svelte";
  import ProductPropertiesList from "./Products/PropertiesList.svelte";
  import ManufacturersList from "./Products/ManufacturersList.svelte";
  import Import from "./Products/Import.svelte";
  import PropertiesList from "./Properties/PropertiesList.svelte";
</script>

<Router>
  <Route path="products/list" component={ProductList} />

  <Route path="products/categories" component={ProductCategoriesList} />

  <Route path="products/properties" component={ProductPropertiesList} />

  <Route path="products/manufacturers" component={ManufacturersList} />
  <Route path="products/import" component={Import} />

  <!-- <Route path="products/new" component={Product} let:params /> -->
  <Route path="products/:id" component={Product} let:params />

  <Route path="properties/list" component={PropertiesList} />
</Router>
