import $api from "../api";
import { ENDPOINTS } from "../config";

export interface Booking {
    id: string;
    data: {
        courierId: number;
        userId: number;
        date: string;
        time: string;
    };
}

export const getBookings = async () => {
    const response = await $api.get<Booking[]>(ENDPOINTS.BOOKINGS);
    return response.data;
};

export const matchesBookingSlot = (
    booking: Booking,
    slot: Pick<Booking["data"], "courierId" | "date" | "time">
) =>
    booking.data.courierId === slot.courierId &&
    booking.data.date === slot.date &&
    booking.data.time === slot.time;

export const toggleBooking = async (data: Booking["data"]) => {
    const bookings = await getBookings();
    const matching = bookings.filter((booking) =>
        matchesBookingSlot(booking, data)
    );

    if (matching.some((booking) => booking.data.userId !== data.userId)) {
        throw new Error("This slot is already reserved.");
    }

    if (matching.length > 0) {
        for (const booking of matching)
            await $api.delete(ENDPOINTS.BOOKING_ID(booking.id));
    } else {
        if (
            bookings.some(
                (booking) =>
                    booking.data.userId === data.userId &&
                    booking.data.date === data.date &&
                    booking.data.time === data.time
            )
        ) {
            throw new Error("You already have a reservation at this time.");
        }
        await $api.post(ENDPOINTS.BOOKINGS, { data: [data] });
    }
};
