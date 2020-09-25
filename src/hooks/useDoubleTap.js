/*
 * https://github.com/minwork/use-double-tap
 */
import { useCallback, useRef } from 'react';

const useDoubleTap = (callback, threshold = 300, options = {}) => {
    const timer = useRef(null)
    const handler = useCallback((event) => {
        if (!timer.current) {
            timer.current = setTimeout(() => {
                if (options.onSingleTap) {
                    options.onSingleTap(event)
                }
                timer.current = null
            }, threshold)
        }
        else {
            clearTimeout(timer.current)
            timer.current = null
            callback && callback(event)
        }
    }, [threshold, options, callback])
    return (callback ? { onClick: handler, } : {})
}

export default useDoubleTap
