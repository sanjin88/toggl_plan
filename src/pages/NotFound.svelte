<script lang="ts">
	import { onDestroy } from 'svelte';
	import { navigate, useLocation } from 'svelte-routing';

	let pathname: string;

	const unsubscribeLocation = useLocation().subscribe((location) => {
		pathname = location.pathname;
	});

	const goToHome = () => {
		navigate('/');
	};

	onDestroy(() => {
		unsubscribeLocation();
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="text-center">
		<h1 class="text-6xl font-bold text-red-600">404 - Not Found</h1>
		<p class="mt-4 text-xl text-gray-700">
			The page "<span class="text-red-600">{pathname}</span> does not exist.
			<button
				on:click={goToHome}
				class="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
				Go to Home
			</button>
		</p>
	</div>
</div>
