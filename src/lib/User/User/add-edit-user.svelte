<script lang="ts">
    import {
        UserModel,
        UserModelWithPasswordSchema
    } from "./models/user.model";
    import type { IUserModelWithPasswordSchema} from "./models/user.model";
    import {createEventDispatcher, onMount} from "svelte";
    import {UserService} from "../services/user/user.service";
    import Loading from "../../Shared/Loading.svelte";
    import {Button, Checkbox, Heading, Input, Label} from "flowbite-svelte";
    import FormError from "../../Shared/form-error.svelte";
    import {ZodError} from "zod";
    import {formatZodErrors} from "../../helpers/errors";
    import {RoleService} from "../services/role/role.service";
    import type {IRole} from "../../Auth/auth.service";
    import {CustomerService} from "../../Customer/services/customer/customer.service";

    const dispatch = createEventDispatcher();
    export let mode: 'user'|'customer'|'admin'|'guest' = 'user';
    export let model: UserModel = new UserModel();
    export let userId: string = undefined;
    export let onSave: (model: UserModel) => void;
    const userService = new UserService();
    let user: IUserModelWithPasswordSchema;
    let errors: {[key: string]: ZodError} = {};
    let roles: IRole[] = [];
    let ready = false;
    onMount(async () => {
        if (userId) {
            model = await userService.findOne(userId, ['*']);
        }

        if (!Array.isArray(model.role)) {
            model.role = [];
        }

        // get roles. If mode is in roles autoselect
        const rolesQuery = await new RoleService().find({limit: 50});
        roles = rolesQuery.data;


        ready = true;
    });


    async function save() {
        errors = {};
        try {
            UserModelWithPasswordSchema
                .refine(data => {
                    return data.password === data.confirmPassword
                }, {
                    message: 'Passwords do not match',
                    path: ['confirmPassword']
                })
                .parse(model);

        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }

        try {
            const res = await new CustomerService().createCustomer(model);
            model.uuid = res.uuid;
        }
        catch (e) {
            handleCreateError(e)
            return
        }

        if (onSave) {
            onSave(model);
        }

        dispatch('saved', model);
    }

    function onRoleChange() {

    }


    function handleCreateError(e) {
        if (e.error && e.error === 'USER_EXISTS') {
            errors = {
                email: {
                    message: 'User with this email already exists',

                }
            }
        }
    }

</script>
{#if !ready}
    <div class="flex justify-center">
        <Loading />
    </div>
    {:else}
    {#if $$slots.heading}
        <slot name="heading">
            <Heading tag="h6" slot="heading"></Heading>
        </slot>
    {/if}


    <form on:submit|preventDefault={save}>
        <div class="my-4">
            <Label for="email">Email</Label>
            <div>
                <Input bind:value={model.email} placeholder="Email"
                       type="text" id="email" name="email" autocomplete="email" />
                <FormError {errors} key="email" />
            </div>
        </div>

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
                       type="text" id="last-name" name="last-name" autocomplete="surname" />
                <FormError {errors} key="lastName" />
            </div>
        </div>


        <div class="my-4">
            <Label for="last-name">Password</Label>
            <div>
                <Input type="password" bind:value={model.password} placeholder="Password"
                        id="password" name="password" autocomplete="password" />
                <FormError {errors} key="password" />
            </div>
        </div>

        <div class="my-4">
            <Label for="last-name">Confirm Password</Label>
            <div>
                <Input type="password" bind:value={model['confirmPassword']} placeholder="Confirm Password"
                       id="confirmPassword" name="confirmPassword" autocomplete="confirmPassword" />
                <FormError {errors} key="confirmPassword" />
            </div>
        </div>

        {#if ['admin', 'user'].indexOf(mode) !== -1}
        <div class="my-4">
            {#each roles as role, idx}
            <Checkbox bind:group={model.role}
                      on:change={onRoleChange}
                      value={role.name}>{role.displayName}</Checkbox>
                {/each}
        </div>
            {/if}

        <div class="my-4">
            <Checkbox value={model.active} checked={model.active} on:change={() => model.active = !model.active}>Active</Checkbox>
        </div>
        <slot name="actions">
            <div class="my-4">
                <Button type="submit" color="blue" class="w-full">Save</Button>
            </div>
        </slot>
    </form>

{/if}
