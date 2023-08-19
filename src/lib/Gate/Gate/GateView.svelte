<script lang="ts">
  import { GateService } from '../services/gate/gate.service';
  import { Modal, Button } from 'flowbite-svelte';
  import { Trash } from 'svelte-heros-v2';
  import { navigate } from 'svelte-navigator';

  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import { AuthService } from '../../Auth/auth.service';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';

  import Input from '../../Shared/Input.svelte';

  const r = new GateService();

  const gateDefault = {
    uuid: null,
    name: '',
    level: 0,
    gate: '',
    provider: '',
  };

  const params = useParams();

  let gateData = gateDefault;

  const defaultGateStatus = {
    name: {
      errors: [],
    },
    level: {
      errors: [],
    },
    gate: {
      errors: [],
    },
    provider: {
      errors: [],
    },
  };

  let gateStatus = defaultGateStatus;

  $: hasGateErrors = Object.values(gateStatus).some((field) => field.errors.length > 0);

  let isGateModalOpen = false;
  let deleteGateModalOpen = false;

  let gate;

  let hasGateDeleteGate = AuthService.hasGate('mcms.admin.gate.delete');

  const getGate = async () => {
    const response = await r.findOne($params.id, ['*']);
    gate = { ...response, level: parseInt(response.level) };
  };
  onMount(async () => {
    await getGate();
  });

  const cancelAddressModal = () => {};

  const openGateModal = () => {
    isGateModalOpen = true;
    gateData = {
      uuid: gate.uuid,
      name: gate.displayName,
      level: gate.level,
      gate: gate.gate,
      provider: gate.provider,
    };
  };

  const confirmGateModal = async () => {
    try {
      gateStatus = clearErrors(gateStatus);
      await r.update(gateData.uuid, { ...gateData, level: parseInt(gateData.level) });

      await getGate();
      isGateModalOpen = false;
      gateData = gateDefault;
    } catch (e) {
      if (e instanceof RequestErrorException) {
        gateStatus = handleValidationErrors(e.details.validationErrors, gateStatus);
        return null;
      }
    }
  };

  const handleDeleteModalOpen = async () => {
    deleteGateModalOpen = true;
  };

  const deleteGate = async () => {
    await r.deleteRow(gate.uuid);
    navigate('/gates/list');
  };
</script>

<Modal bind:open={isGateModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Update gate info</h2>

    <div class="mb-4">
      <Input label="Name" bind:errors={gateStatus.name.errors} bind:value={gateData.name} required />
    </div>

    <div class="mb-4">
      <Input type="number" label="Level" bind:errors={gateStatus.level.errors} bind:value={gateData.level} required />
    </div>

    <div class="mb-4">
      <Input label="Provider" bind:errors={gateStatus.provider.errors} bind:value={gateData.provider} required />
    </div>

    <div class="mb-4">
      <Input label="Gate" bind:errors={gateStatus.gate.errors} bind:value={gateData.gate} required />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button disabled={hasGateErrors} on:click={confirmGateModal}>Update</Button>
    <Button color="alternative" on:click={cancelAddressModal}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal title="Confirm delete gate" bind:open={deleteGateModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
    gate
    <span class="text-lg font-bold">{gate.displayName}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => deleteGate()}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !gate}
  <div class="w-full text-center items-center h-64">
    <p>Loading...</p>
  </div>
{:else}
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="flex justify-between items-center">
        <div class="w-40" />
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Gate {gate.name}
        </h2>
        <div class="flex items-center w-40">
          {#if hasGateDeleteGate}
            <button on:click={() => handleDeleteModalOpen()} class="text-gray-500"><Trash color="white" /></button>
          {/if}
        </div>
      </div>
      <div class="flex my-10">
        <div
          class="flex-1 p-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex flex-col md:flex-row justify-between items-start">
            <div>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Uuid:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{gate.uuid}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Name:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{gate.name}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Gate:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{gate.gate}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Provider:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{gate.provider}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Level:</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{gate.level}</p>
            </div>
            <div class="flex mt-4 md:mt-0">
              <Button size="md" on:click={() => openGateModal()}>Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}
