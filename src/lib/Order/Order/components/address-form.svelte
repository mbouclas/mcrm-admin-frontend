<script lang="ts">
import {createEventDispatcher} from "svelte";
import {formatZodErrors} from "../../../helpers/errors";
import {Button, Heading, Input, Label, Select} from "flowbite-svelte";
import FormError from '../../../Shared/form-error.svelte';
import {type AddressModel, addressSchema} from "../models/address.model";
import {ZodError} from "zod";


const dispatch = createEventDispatcher();

export let formTitle = 'Add new address';
const countries = [
    {name: 'Cyprus', slug: 'cyprus'},
    {name: 'Greece', slug: 'greece'},
    {name: 'United Kingdom', slug: 'uk'},
];


let errors = {};
const defaultModel: AddressModel = {
    country: countries[0].slug,
};
export let model: AddressModel = {};
export let onSave = (model: AddressModel) => {};
model = {...model, ...defaultModel};

async function validate() {
    errors = {};
    try {
        addressSchema.parse(model);
    }
    catch (e) {
        if (e instanceof ZodError) {
            errors = formatZodErrors(e)
        }
        return;
    }

    if (onSave) {
        onSave(model);
    }

    dispatch('formValid', model);
}

</script>

<form on:submit|preventDefault={validate}>
    <slot name="heading">
        <Heading tag="h6">{formTitle}</Heading>
    </slot>

        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div class="my-4">
                <Label for="first-name">First name</Label>
                <div>
                    <Input bind:value={model.firstName} placeholder="Name"
                           type="text" id="first-name" name="first-name" autocomplete="given-name" />
                    <FormError {errors} key="firstName" />
                </div>
            </div>


            <div class="my-4">
                <Label for="last-name">Last name</Label>
                <div>
                    <Input bind:value={model.lastName} placeholder="Surname"
                           type="text" id="last-name" name="last-name" autocomplete="family-name" />
                    <FormError {errors} key="lastName" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <Label for="company">Company</Label>
                <div>
                    <Input bind:value={model.company} placeholder="Company name"
                           type="text" name="company" id="company" />
                    <FormError {errors} key="company" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <Label for="address">Address</Label>
                <div>
                    <Input bind:value={model.street} placeholder="Street address"
                           type="text" name="address" id="address" autocomplete="street-address" />
                    <FormError {errors} key="street" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <Label for="apartment">Apartment, suite, etc.</Label>
                <div>
                    <Input bind:value={model.apartment} placeholder="Apartment, suite, etc."
                           type="text" name="apartment" id="apartment" />

                </div>
            </div>

            <div class="my-4">
                <Label for="city">City</Label>
                <div>
                    <Input bind:value={model.city} placeholder="City"
                           type="text" name="city" id="city" autocomplete="address-level2" />
                    <FormError {errors} key="city" />
                </div>
            </div>

            <div class="my-4">
                <Label for="country">Country</Label>
                <div>
                    <Select bind:value={model.country}
                            id="country" name="country" autocomplete="country-name">
                        {#each countries as country}
                        <option value={country.slug}>{country.name}</option>
                            {/each}
                    </Select>
                    <FormError {errors} key="country" />
                </div>
            </div>

            <div class="my-4">
                <Label for="region">State / Province</Label>
                <div>
                    <Input bind:value={model.region} placeholder="State / Province"
                           type="text" name="region" id="region" autocomplete="address-level1" />
                    <FormError {errors} key="region" />
                </div>
            </div>

            <div class="my-4">
                <Label for="postal-code">Postal code</Label>
                <div>
                    <Input bind:value={model.postCode} placeholder="Postal code"
                           type="text" name="postal-code" id="postal-code" autocomplete="postal-code" />
                    <FormError {errors} key="postCode" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <Label for="phone">Phone</Label>
                <div>
                    <Input bind:value={model.phone} placeholder="Phone number"
                           type="text" name="phone" id="phone" autocomplete="tel" />
                    <FormError {errors} key="phone" />
                </div>
            </div>
        </div>


        <slot name="actions">
            <div class="my-4">
                <Button type="submit" color="blue" class="w-full">Continue</Button>
            </div>
        </slot>

</form>
