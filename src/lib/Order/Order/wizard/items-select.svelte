<script lang="ts">
 import {OrderModel} from "../models/order.model";
import ProductSelector from '../../../Catalogue/Products/product-selector.svelte';
import type {ProductVariantModel} from "../../../Catalogue/models/product-variant.model";
import {ProductModel} from "../../../Catalogue/models/product.model";
 import {Button, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
 import {Cart} from "../models/cart";
 import {CartItem} from "../models/cart-item";
 import {moneyFormat} from "../../../helpers/money";
 import {DotsVertical} from "radix-icons-svelte";
 import {Plus} from "svelte-heros-v2";


export let model: OrderModel = new OrderModel();
 export let isValid = false;
 export let onValid: (model: OrderModel) => void;

let selectedItem,
        selectedProducts: ProductModel[] = [],
        showProductSelectorModal = false,
        cartItems: CartItem[] = [],
        summary = {
        items: 0,
         conditions: [],
         total: 0
        },
cart = new Cart({
 userId: model.userId,
});

function onSelect(e) {
  // selectedItem = e.detail;
  // showModalItemSelectorModal = true;
}

async function onSelectProduct(item: ProductModel) {
 const cartItem = CartItem.productToCartItem(item);
 await cart.add(cartItem);
 cartItems = [...cart.items];
 updateSummary();
 showProductSelectorModal = false;
 selectedProducts.push(item);
 isValid = true;

 if (onValid) {
  onValid(model);
 }
}

async function onSelectProductVariant(item: ProductModel, variant: ProductVariantModel) {
 const cartItem = CartItem.productVariantToCartItem(item, variant);
 await cart.add(cartItem);

 cartItems = [...cart.items];
 updateSummary();
 showProductSelectorModal = false;
 selectedProducts.push(item);
 isValid = true;

 if (onValid) {
  onValid(model);
 }

}

function updateSummary() {
 summary = Object.assign({}, {
  total: cart.total,
  items: cart.items.length,
  conditions: cart.appliedConditions,
 });

 model.metaData.cart = cart;
 model.selectedProducts = selectedProducts;
}

function getVariantInfo(item: CartItem) {
 const properties = ProductModel.getProductVariantProperties(selectedProducts.find(p => p.uuid === item.productId));
 const values = [];

 for (const key in item.metaData) {
   const found = properties.find(p => p.slug === key);
   if (!found) {continue}
    found.values.forEach(v => {
     if (found.type === 'color' && v.code === item.metaData[key].code) {
      values.push({
       property: found.title,
       name: v.name,
       value: v.code
      });
      return;
     }

        if (v.slug === item.metaData[key].value) {
            values.push({
             property: found.title,
            name: v.name,
            value: v.slug
            });
        }
    });

   return values;
 }
}
</script>
<div class="my-4">

 <Modal size="xl" bind:open={showProductSelectorModal} title={`Select Product`}>
 <ProductSelector bind:selectedItem={selectedItem}
  onSelectProduct={onSelectProduct} onSelectProductVariant={onSelectProductVariant}>

 </ProductSelector>
 </Modal>

 <div class="flex justify-end">
  <Button color="green" on:click={() => showProductSelectorModal = true}><Plus /> Add Product</Button>
 </div>

<div class="my-4">
 <Table>
  <TableHead>
   <TableHeadCell></TableHeadCell>
   <TableHeadCell>SKU</TableHeadCell>
   <TableHeadCell>Title</TableHeadCell>
   <TableHeadCell>Quantity</TableHeadCell>
   <TableHeadCell>Variant</TableHeadCell>
   <TableHeadCell>Price</TableHeadCell>
   <TableHeadCell>Actions</TableHeadCell>
  </TableHead>
  <TableBody>
   {#each cartItems as item}
  <TableBodyRow>
   <TableBodyCell><img src={item.thumb} class="w-16 object-cover" /></TableBodyCell>
   <TableBodyCell>{item.sku}</TableBodyCell>
    <TableBodyCell>{item.title}</TableBodyCell>
    <TableBodyCell>{item.quantity}</TableBodyCell>
    <TableBodyCell>
     {#if item.variantId}
      {#each getVariantInfo(item) as v}
       <div class="flex items-center">
        <div class="w-4 h-4 rounded-full mr-2">{v.property}: {v.name}</div>
       </div>
       {/each}
      {/if}
     </TableBodyCell>
    <TableBodyCell>{moneyFormat(item.price)}</TableBodyCell>
    <TableBodyCell>
     <Button>
      <DotsVertical/>
     </Button>
    </TableBodyCell>
  </TableBodyRow>
    {/each}
  </TableBody>
  {#if summary.items > 0}
   <tfoot>
   {#if summary.conditions.length > 0}
    {#each summary.conditions as condition}
    <tr class="font-semibold text-gray-900 dark:text-white">
     <th scope="row" class="py-3 px-6 text-base">{condition.title}</th>
     <td colspan="4"></td>
     <td class="py-3 px-6">{moneyFormat(condition.parsedRawValue)}</td>
     <td></td>
    </tr>
     {/each}
    {/if}
   <tr class="font-semibold text-gray-900 dark:text-white">
    <th scope="row" class="py-3 px-6 text-base">Total</th>
    <td class="py-3 px-6"></td>
    <td class="py-3 px-6"></td>
    <td class="py-3 px-6">{summary.items}</td>
    <td class="py-3 px-6"></td>
    <td class="py-3 px-6">{moneyFormat(summary.total)}</td>
    <td class="py-3 px-6"></td>
   </tr>
   </tfoot>
   {/if}
 </Table>
</div>
</div>

