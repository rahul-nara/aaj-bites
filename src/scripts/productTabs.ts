const SECTION = ".product__tabs__section";
const WRAPPER = ".tabs__wrapper";
const TAB_BUTTON = ".tabs__list__item__button[data-tab-index]";
const TAB_PANEL = ".tabs__content__items[data-tab-index]";

export function initProductTabs(): void {
	const wrapper = document.querySelector(`${SECTION} ${WRAPPER}`);
	if (!wrapper) return;

	const tabButtons = wrapper.querySelectorAll<HTMLButtonElement>(TAB_BUTTON);
	const panels = wrapper.querySelectorAll<HTMLElement>(TAB_PANEL);

	if (!tabButtons.length || !panels.length) return;

	const setActive = (index: number): void => {
		tabButtons.forEach((btn) => {
			const i = Number(btn.getAttribute("data-tab-index"));
			const active = i === index;
			btn.classList.toggle("is-active", active);
			btn.setAttribute("aria-selected", String(active));
		});

		panels.forEach((panel) => {
			const i = Number(panel.getAttribute("data-tab-index"));
			const active = i === index;
			panel.classList.toggle("is-active", active);
			if (active) panel.removeAttribute("hidden");
			else panel.setAttribute("hidden", "");
		});
	};

	tabButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const raw = btn.getAttribute("data-tab-index");
			const parsed = raw === null ? NaN : Number(raw);
			if (Number.isNaN(parsed)) return;
			setActive(parsed);
		});
	});

	const first = Number(tabButtons[0]?.getAttribute("data-tab-index"));
	setActive(Number.isNaN(first) ? 0 : first);
}
