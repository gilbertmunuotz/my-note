export function formatDate(date: string): string {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric"
    });
}