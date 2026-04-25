import { useUiStore } from './ui.store'

export const useThemeMode = () => useUiStore((s) => s.theme)

