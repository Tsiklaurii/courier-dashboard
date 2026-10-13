import { useEffect, useRef, useState } from "react";
import type { User } from "../service/auth/auth.types";
import { getBookings, toggleBooking, type Booking } from "../service/bookings";

export default function useBookings(currentUser: User) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsReady, setBookingsReady] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [pending, setPending] = useState(false);
    const busy = useRef(false);

    useEffect(() => {
        let active = true;
        const refreshBookings = async () => {
            if (busy.current) return;
            try {
                const response = await getBookings();
                if (active && !busy.current) {
                    setBookings(response);
                    setBookingsReady(true);
                    setBookingError("");
                }
            } catch {
                if (active && !busy.current) {
                    setBookingsReady(false);
                    setBookingError("Could not load reservations. Try again.");
                }
            }
        };
        refreshBookings();
        const interval = window.setInterval(refreshBookings, 15000);
        window.addEventListener("focus", refreshBookings);
        return () => {
            active = false;
            window.clearInterval(interval);
            window.removeEventListener("focus", refreshBookings);
        };
    }, []);

    const handleBooking = async (
        courierId: number,
        date: string,
        time: string
    ) => {
        if (currentUser.role !== "user" || busy.current || !bookingsReady)
            return;
        busy.current = true;
        setPending(true);
        setBookingError("");
        try {
            await toggleBooking({
                courierId,
                userId: currentUser.id,
                date,
                time,
            });
        } catch (error) {
            setBookingError(
                error instanceof Error
                    ? error.message
                    : "Could not change your reservation."
            );
        } finally {
            try {
                setBookings(await getBookings());
                setBookingsReady(true);
            } catch {
                setBookingsReady(false);
                setBookingError("Could not refresh reservations.");
            }
            busy.current = false;
            setPending(false);
        }
    };

    return { bookings, bookingsReady, bookingError, pending, handleBooking };
}
