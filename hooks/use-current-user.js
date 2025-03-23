import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";


// Version one in which settings page is not automatically load after login.
export const useCurrentUser = () => {
    const session = useSession();

    return session?.data.user || null;
}
export default useCurrentUser

// Version one in which settings page is automatically load after login and wait for session to load.
// export const useCurrentUser = () => {
//     const { data: session, status } = useSession();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (status === "authenticated" && session?.user) {
//             setUser(session.user);
//             setLoading(false);
//         } else if (status === "unauthenticated") {
//             setUser(null);
//             setLoading(false);
//         }
//     }, [session, status]);

//     return { user, loading };
// }