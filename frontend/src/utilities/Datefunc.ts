export function formatDate(date: string): string {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    });
}