<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'border-input bg-foreground ring-offset-background w-full h-[56px] data-[placeholder]:text-muted-foreground text-background focus:ring-ring flex items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
