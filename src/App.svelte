<script lang="ts">
	import { Router, Route } from 'svelte-routing';
	import { MAIN_ROUTES } from './routes/main_routes';
</script>

<Router>
	{#each MAIN_ROUTES as { path, component } (path)}
		<Route {path} {component} />
	{/each}
</Router>
