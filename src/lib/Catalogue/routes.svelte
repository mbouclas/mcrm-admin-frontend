<script>
  import { Router, Route, Link } from 'mcrm-svelte-navigator';
  import Product from './Products/Product.svelte';
  import ProductList from './Products/Products.svelte';
  import Manufacturer from './Manufacturers/Manufacturer.svelte';
  import ManufacturerList from './Manufacturers/Manufacturers.svelte';
  import ProductCategoriesList from './Products/ProductCategoriesList.svelte';
  import ProductPropertiesList from './Products/PropertiesList.svelte';
  import Import from './Import/Import.svelte';
  import PropertiesList from './Properties/PropertiesList.svelte';
  import Property from './Properties/Property.svelte';
</script>

<Router>
  <Route path="products/list" component={ProductList} />

  <Route path="categories" component={ProductCategoriesList} />

  <Route path="products/properties" component={ProductPropertiesList} />

  <Route path="products/import" component={Import} />

  <!-- <Route path="products/new" component={Product} let:params /> -->
  <Route path="products/:id" component={Product} let:params />

  <Route path="properties/list" component={PropertiesList} />

  <!-- <Route path="properties/new" component={Property} let:params /> -->
  <Route path="properties/:id" component={Property} let:params />

  <Route path="manufacturers/list" component={ManufacturerList} />
  <!-- <Route path="products/new" component={Product} let:params /> -->
  <Route path="manufacturers/:id" component={Manufacturer} let:params />
</Router>
