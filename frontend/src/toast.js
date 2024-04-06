import { toast } from 'react-toastify';

// Modified version of the example from here: https://fkhadra.github.io/react-toastify/positioning-toast
// Extracted into it's own function for use wherever

export const notify = (m, l) => {
    switch (l) {
        case 'success':
            toast.success(m);
            break;
        case 'info':
            toast.info(m);
            break;
        case 'warn':
            toast.warn(m);
            break;
        case 'error':
            toast.error(m);
            break;
        default:
            toast(m);
            break;
    }
}