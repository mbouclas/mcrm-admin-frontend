<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Loading from "../../../Shared/Loading.svelte";

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;

  const statusLabels = {
    0: "Edit",
    1: "Creating",
    2: "CANCEL",
  };

  let statusIndex = 0;
  $: {
    if (fields && fields.length) {
      statusIndex = fields.findIndex((field) => field.varName === "status");

      fields[statusIndex].ui.values = fields[statusIndex].ui.defaultValues.map(
        (value) => ({ label: statusLabels[value], value })
      );
    }
  }

  const onStatusChange = () => {
    console.log("change");
  };

  $: if (model) {
    model.addresses = model.address ? [model.address] : [];
  }
</script>

{#if !model}
  <Loading />
{:else}
  <div class="container">
    <div class="section">
      <div class="section-header">General Information</div>
      <div class="section-body">
        <div class="field field-general">
          <span class="field-name">Uuid</span>
          <span class="field-value">{model.uuid}</span>
        </div>

        <div class="field field-general">
          <span class="field-name">Order Id</span>
          <span class="field-value">{model.orderId}</span>
        </div>

        <div class="field field-general">
          <span class="field-name">Status</span>
          <span class="field-value">{model.status}</span>
        </div>

        <div class="field field-general">
          <span class="field-name">Created At</span>
          <span class="field-value">{model.createdAt}</span>
        </div>

        <div class="field field-general">
          <span class="field-name">VAT</span>
          <span class="field-value">{model.VAT}</span>
        </div>
        <div class="field field-general">
          <span class="field-name">Total</span>
          <span class="field-value">{model.total}</span>
        </div>

        {#if model?.metaData?.notes}
          <div class="field field-general">
            <span class="field-name">Notes</span>
            <span class="field-value">{model.metaData.notes}</span>
          </div>
        {/if}

        {#if model?.metaData?.preferredDeliveryDate}
          <div class="field field-general">
            <span class="field-name">Preferred Delivery Date</span>
            <span class="field-value"
              >{model.metaData.preferredDeliveryDate}</span
            >
          </div>
        {/if}
      </div>
    </div>

    <div class="section">
      <div class="section-header">Customer Information</div>
      <div class="section-body">
        <div class="field field-general">
          <span class="field-name">Name</span>
          <span class="field-value"
            >{model.user.firstName}, {model.user.lastName}</span
          >
        </div>
        <div class="field field-general">
          <span class="field-name">Email</span>
          <span class="field-value">{model.user.email}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">Addresses</div>
      <div class="section-body">
        {#each model.addresses as address}
          <div class="address">
            <div class="field field-address">
              <span class="field-name">First Name</span>
              <span class="field-value">{address.firstName}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Last Name</span>
              <span class="field-value">{address.lastName}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Street</span>
              <span class="field-value">{address.street}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Apartment</span>
              <span class="field-value">{address.apartment}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">City</span>
              <span class="field-value">{address.city}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Region</span>
              <span class="field-value">{address.region}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Post Code</span>
              <span class="field-value">{address.postCode}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Country</span>
              <span class="field-value">{address.country}</span>
            </div>
            <div class="field field-address">
              <span class="field-name">Phone</span>
              <span class="field-value">{address.phone}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="section">
      <div class="sub-sections">
        <div class="sub-section">
          <div class="sub-section-header">Payment Method</div>
          <div class="sub-section-body">
            <div class="field">
              <span class="field-name">Method</span>
              <span class="field-value">{model.paymentMethod.title}</span>
            </div>
            <div class="field">
              <span class="field-name">Description</span>
              <span class="field-value">{model.paymentMethod.description}</span>
            </div>
          </div>
        </div>

        <div class="sub-section">
          <div class="sub-section-header">Shipping Method</div>
          <div class="sub-section-body">
            <div class="field">
              <span class="field-name">Method</span>
              <span class="field-value">{model.shippingMethod.title}</span>
            </div>
            <div class="field">
              <span class="field-name">Shipping Time</span>
              <span class="field-value"
                >{model.shippingMethod.shippingTime}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-body">
        <div class="cart-section">
          <div class="section-header">Items</div>
          <div class="section-body">
            {#each model.metaData.cart.items as item (item.uuid)}
              <div class="cart-item">
                <div class="item-details">
                  <div class="field">
                    <span class="field-name">Product Title</span>
                    <span class="field-value">{item.title}</span>
                  </div>
                  <div class="field">
                    <span class="field-name">Quantity</span>
                    <span class="field-value">{item.quantity}</span>
                  </div>
                  <div class="field">
                    <span class="field-name">Price</span>
                    <span class="field-value">${item.price}</span>
                  </div>
                  <div class="field">
                    <span class="field-name">Color</span>
                    <span class="field-value">{item.metaData.color.name}</span>
                  </div>
                </div>
                <div class="item-image-wrapper">
                  <img src={item.thumb} alt={item.title} class="item-image" />
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    width: 95%;
    margin: 50px auto;
    border-radius: 12px;
    background: linear-gradient(90deg, #666666, #323232);

    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .section-header {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111;
    background: linear-gradient(145deg, #f9f9f9, #ececec);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    letter-spacing: 1px;
  }

  .section {
    padding: 10px 50px;
    max-width: 1200px;
    margin: auto;
  }

  .field {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    background-color: #f9f9f9;
    border-radius: 6px;
  }

  .field-general {
    padding: 10px;
    margin-bottom: 20px;
  }

  .field-name {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    text-align: right;
    width: 150px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .field-value {
    color: #111;
    font-weight: 400;
    font-size: 16px;
    flex-grow: 1;
    padding-left: 20px;
    text-align: left;
  }

  .sub-sections {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .sub-section {
    background-color: #444;
    border-radius: 8px;
    width: 48%;
    padding: 20px;
  }

  .sub-section-header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #f9f9f9;
    text-align: center;
  }

  .sub-section-body .field {
    background-color: transparent;
    padding: 5px;
  }

  .sub-section-body .field-name,
  .sub-section-body .field-value {
    color: #f9f9f9;
  }

  .cart-section {
    margin-top: 30px;
  }

  .cart-item {
    display: flex;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 6px;
    height: 180px;
    align-items: center;
  }

  .item-image-wrapper {
    flex: 1;
    height: 100%;
    padding: 0 10px;
  }

  .item-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .item-details {
    flex: 3;
    padding: 0 10px;
  }

  .field-address {
    margin-bottom: 15px;
  }
</style>
