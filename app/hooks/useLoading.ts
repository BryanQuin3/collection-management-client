import { useEffect,useState } from "react";

export function useLoading(status:string | undefined) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (status) {
            setLoading(false);
            status = ''
        }
    }, [status]);

    return {loading, setLoading}
}