export const fetchChartData = async () => {
    const response = await fetch('/api/chart-data'); // Adjust the endpoint as needed
    if (!response.ok) {
        throw new Error('Failed to fetch chart data');
    }
    return response.json();
};