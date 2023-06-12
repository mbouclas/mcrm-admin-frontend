<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Loading from "../../../Shared/Loading.svelte";
  import { FileService } from "../../../Shared/files.service.ts";

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;

  let fileService = new FileService();

  const statusLabels = {
    0: { name: "Edit", color: "yellow" },
    1: { name: "Creating", color: "#4caf50" },
    2: { name: "Cancel", color: "red" },
  };

  let statusIndex = 0;
  let shippingAddress;
  let billingAddress;
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

  let formattedCreatedAt = "";
  $: if (model) {
    shippingAddress = model.address.find(
      (address) =>
        address.type.includes("SHIPPING") || address.type.includes("shipping")
    );
    billingAddress = model.address.find(
      (address) =>
        address.type.includes("BILLING") || address.type.includes("billing")
    );

    const date = new Date(model.createdAt);

    formattedCreatedAt = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  const downloadFile = (file) => {
    fileService
      .getFile(file.filename)
      .then((data) => {
        window.open(data.url, "_blank");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
</script>

{#if !model}
  <Loading />
{:else}
  <div class="container">
    <div class="layout-header">
      <span class="order">Order</span> /#{model.orderId} /
      <span
        class="status"
        style={`background-color: ${statusLabels[model.status].color}`}
        >{statusLabels[model.status].name}</span
      >
      / Created at {formattedCreatedAt}
    </div>
    <div class="layout">
      <div class="main-content">
        <!-- Put all content except the customer information here -->

        <div class="section">
          <div class="section-header">General Information</div>
          <div class="section-body">
            <div class="field field-general">
              <span class="field-name">Uuid</span>
              <span class="field-value">{model.uuid}</span>
            </div>

            <div class="field field-general">
              <span class="field-name">VAT</span>
              <span class="field-value">{model.VAT}</span>
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
          <div class="section-body">
            <div class="cart-section">
              <div class="section-header">Items</div>
              <div class="section-body">
                {#each model.metaData.cart.items as item (item.uuid)}
                  <div class="item">
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
                          <span class="field-value"
                            >{item.metaData.color.name}</span
                          >
                        </div>
                      </div>
                      <div class="item-image-wrapper">
                        <img
                          src={item.thumb}
                          alt={item.title}
                          class="item-image"
                        />
                      </div>
                    </div>

                    {#if item?.metaData?.uploadedFiles?.length}
                      <div class="attachments">
                        {#each item?.metaData?.uploadedFiles as file}
                          <div class="attachment">
                            <div class="attachment-info">
                              <div class="filename">{file.filename}</div>
                              <div class="description">{file.description}</div>
                            </div>

                            <div class="download-button">
                              <button on:click={() => downloadFile(file)}
                                >Download</button
                              >
                            </div>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <!-- Move the customer information section here -->
        <div class="section">
          <div class="side-section-header">Customer Information</div>
          <div class="section-body">
            <div class="field sidebar-field">
              <span class="field-value"
                >{model.user.firstName}, {model.user.lastName}</span
              >
            </div>
            <div class="field sidebar-field">
              <span class="field-value">{model.user.email}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="side-section-header">Shipping address</div>
          <div class="section-body">
            <div class="address">
              <div class="field sidebar-field">
                <span class="field-value"
                  >{shippingAddress.firstName}, {shippingAddress.lastName}, {shippingAddress.phone}</span
                >
              </div>

              <div class="field sidebar-field">
                <span class="field-value"
                  >{shippingAddress.country}, {shippingAddress.city}, {shippingAddress.region},
                  {shippingAddress.postCode}</span
                >
              </div>

              <div class="field sidebar-field">
                <span class="field-value"
                  >{shippingAddress.street}, {shippingAddress.apartment}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="side-section-header">Payment Method</div>
          <div class="section-body">
            <div class="field sidebar-field">
              <span class="field-value">{model.paymentMethod.title}</span>
            </div>
            <div class="field sidebar-field">
              <span class="field-value">{model.paymentMethod.description}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="side-section-header">Billing address</div>
          <div class="section-body">
            <div class="address">
              <div class="field sidebar-field">
                <span class="field-value"
                  >{billingAddress.firstName}, {billingAddress.lastName}, {billingAddress.phone}</span
                >
              </div>

              <div class="field sidebar-field">
                <span class="field-value"
                  >{billingAddress.country}, {billingAddress.city}, {billingAddress.region},
                  {billingAddress.postCode}</span
                >
              </div>
            </div>
          </div>

          <div class="field sidebar-field">
            <span class="field-value"
              >{shippingAddress.street}, {shippingAddress.apartment}</span
            >
          </div>
        </div>

        <div class="section">
          <div class="side-section-header">Shipping Method</div>
          <div class="section-body">
            <div class="field sidebar-field">
              <span class="field-value">{model.shippingMethod.title}</span>
            </div>
            <div class="field sidebar-field">
              <span class="field-value"
                >{model.shippingMethod.shippingTime}</span
              >
            </div>
          </div>
        </div>

        <div class="total-field">
          <span class="total-field-item">Total</span>
          <span class="total-field-item">{model.total.toFixed(3)}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    margin: 50px auto;
    position: relative;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background: linear-gradient(145deg, #cdcdcd, #fff);
  }

  .layout {
    display: flex;
  }

  .layout-header {
    display: flex;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(145deg, #f9f9f9, #ececec);
    color: #111;
    padding: 5px;
    margin: 5px;
    margin-bottom: 10px;
    border-radius: 8px;
    align-items: flex-end;
    box-shadow: -2px 7px 10px rgba(0, 0, 0, 0.1);
  }

  .main-content {
    flex: 3;
    margin-right: 20px;
  }

  .sidebar {
    flex: 1;
    position: sticky;
    top: 0;
    background: linear-gradient(145deg, #f9f9f9, #ececec);
    padding: 20px 3px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    height: 100vh;
    overflow-y: auto;
    border-radius: 8px;
    margin-top: 5px;
  }

  .section-header {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111;
    background: linear-gradient(145deg, #f9f9f9, #d1d1d1);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    letter-spacing: 1px;
  }

  .side-section-header {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: white;
    background: linear-gradient(145deg, #cdcdcd, #444);

    padding: 10px;
    border-radius: 8px;
    text-align: center;
    letter-spacing: 1px;
  }

  .section {
    padding: 5px;
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
    margin-bottom: 10px;
  }

  .field-name {
    color: #333;
    font-weight: 600;
    font-size: 12px;
    text-align: right;
    width: 150px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .field-value {
    color: #111;
    font-weight: 400;
    font-size: 12px;
    flex-grow: 1;
    padding-left: 20px;
    text-align: left;
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

  .sidebar-field {
    margin-bottom: 2px;
    background: transparent;
  }

  .total-field-item {
    font-size: 24px;
    color: #f9f9f9;
    font-weight: 600;
    padding: 5px 10px;
  }

  .total-field {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(145deg, #6a6a6a, #444);
    border-radius: 8px;
    padding: 5px;
    margin: 0px 5px;
  }

  .status {
    padding: 0px 5px;
    margin: 0px 5px;
    border-radius: 8px;
  }

  .order {
    font-size: 30px;
    color: #111;
    font-weight: 600;
    padding: 0px 10px;
    position: relative;
    top: 5px;
  }
  .item {
    background-color: #f9f9f9;
    border-radius: 8px;
  }

  .attachment {
    color: #111;
  }

  .attachments {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  .attachment {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(0deg, #e0ffdb, #f9f9f9);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    align-items: center;
  }

  .attachment-info {
    display: flex;
    flex-direction: column;
  }

  .filename {
    font-size: 18px;
    color: #111;
    font-weight: 600;
  }

  .description {
    font-size: 14px;
    color: #666;
  }

  .download-button button {
    cursor: pointer;
    display: inline-block;
    background-color: #4caf50;
    border: none;
    color: white;
    text-align: center;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
  }

  .download-button button:hover {
    background-color: #45a049;
  }
</style>
