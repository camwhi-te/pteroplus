import { usePersistedState } from './usePersistedState';

type DefaultsMap = Record<string, boolean>;

export const pteroplusSettings = {
    simple_console: false,
    grid_layout: false,
    navbar_controls: true,
    settings_warning: true,
} as const;

export const GET = 0;
export const SET = 1;

export const usePteroplusConfig = <T extends DefaultsMap>(defaults: T) => {
    type FeatureKey = keyof T;

    const featureState = {} as Record<FeatureKey, [boolean, (value: boolean) => void]>;

    (Object.keys(defaults) as FeatureKey[]).forEach((key) => {
        featureState[key] = usePersistedState<boolean>(`pp::${String(key)}`, defaults[key]) as [
            boolean,
            (value: boolean) => void
        ];
    });

    return featureState;
};
