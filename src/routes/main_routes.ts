import Timeline from '../pages/Timeline.svelte';
import NotFound from '../pages/NotFound.svelte';

export const MAIN_ROUTES = [
    { path: '*', component: NotFound },
    { path: '/', component: Timeline },
]