/*Функция для имитации задержки в тестах.*/
export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));
