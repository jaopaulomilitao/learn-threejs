"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export const AuthListener = () => {
    const initAuthListener = useAuthStore((state) => state.initAuthListener);

    useEffect(() => {
        // starts the global firebase authentication listener
        initAuthListener();
    }, [initAuthListener]);

    // returns nothing, as this is purely a logical component
    return null;
};