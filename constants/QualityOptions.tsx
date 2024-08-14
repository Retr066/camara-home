import { Quality } from "@/components/types/Quality";

interface QualityOption {
    label: string;
    value: Quality; // Puede ser un valor de Quality o una cadena vacía
}

export const qualityOptions: QualityOption[] = [
    { label: 'Auto', value: '' },
    { label: '1080p', value: 'hight' },
    { label: '720p', value: 'medium' },
    { label: '640p', value: 'low' },
];
