import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../store';

// do not use it root store imports slice from your feature. It will cause dependency cycle
// move redux slice to root level or move it to context to use this hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
