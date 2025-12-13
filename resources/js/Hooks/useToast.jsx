// File: resources/js/Hooks/useToast.jsx
import { useToast as useShadcnToast } from "@/Components/ui/use-toast"; // MENGGUNAKAN ALIAS @

// Export hook yang sudah dibungkus
export function useToast() {
    // ...
    const { toast, dismiss } = useShadcnToast();
    return { toast, dismiss };
}